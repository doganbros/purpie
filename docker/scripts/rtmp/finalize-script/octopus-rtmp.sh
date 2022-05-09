#!/bin/bash

echo "" >> /config/token.txt
source /config/token.txt

MAX_EVENT_TRIES=$((3))
NUMBER_OF_TRIES=$((0))

DATE="$(date)"

EVENT_TYPE=$1
TEMP_ID=$2
USER_ID=$(cut -d "=" -f2-<<< $TEMP_ID)
VIDEO_ID=$3
FILE_ID=$VIDEO_ID
FILENAME=$4
FINAL_STATUS_CODE=0
echo "#################################### $DATE --- Reporting Event to Octopus #########################################################" 
echo "1: $1 - 2: $2 - 3:$3 - 4: $4"  
echo "$DATE --- Event Type: $EVENT_TYPE - User ID: $USER_ID - Video ID: $VIDEO_ID" 

strpos() { 
  haystack=$1
  needle=${2//\*/\\*}
  x="${haystack%%$needle*}"
  [[ "$x" = "$haystack" ]] && echo -1 || echo "${#x}"
}


pos=$(strpos $VIDEO_ID _)

if [[ $pos -ge 0 ]]
then
    OCTOPUS_URL="https://${VIDEO_ID:$((pos + 1))}"
fi

upload() {
  # Set credentials for aws cli
  aws configure set aws_access_key_id $AWS_ACCESS_KEY
  aws configure set aws_secret_access_key $AWS_SECRET_KEY
  aws configure set default.region $AWS_DEFAULT_REGION
  # Upload to S3
  aws s3 sync /home/recordings/$FILE_ID s3://$S3_BUCKET_NAME/meeting-recordings/$FILE_ID/
  S3_EXIT_CODE=$(echo $?)
  if [[ $S3_EXIT_CODE == 0 ]] 
    then
    echo "/home/recordings/$FILE_ID successfully synced with $S3_BUCKET_NAME/meeting-recordings/$FOLDER_NAME/" >>/tmp/octopus-rtmp.log
    else
    echo "/home/recordings/$FILE_ID failed to sync with $S3_BUCKET_NAME/meeting-recordings/$FOLDER_NAME/. Status Code: $S3_EXIT_CODE" >>/tmp/octopus-rtmp.log
  fi
}

auth() {
  echo "$DATE - Authentication Token Expired. Attempting to Use Refresh Token." >>/tmp/octopus-rtmp.log
  RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -d '{"refreshToken": "'"$REFRESH_TOKEN"'"}' ${OCTOPUS_URL}/v1/auth/client/refresh-token)
  AUTH_STATUS_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
  if [[ ${AUTH_STATUS_CODE} == 200 ]]; then
    echo "$DATE - Auth token successfully renewed" >>/tmp/octopus-rtmp.log
  elif [[ ${AUTH_STATUS_CODE} == 401 || ${AUTH_STATUS_CODE} == 403 || ${AUTH_STATUS_CODE} == 400 ]]; then
    echo "$DATE - Refresh Token has expired. Re-authing to Octopus..." >>/tmp/octopus-rtmp.log
    RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -d '{"apiKey": "'"$OCTOPUS_API_KEY"'", "apiSecret": "'"$OCTOPUS_API_SECRET"'"}' ${OCTOPUS_URL}/v1/auth/client/login)
    LOGIN_RETURN_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
    if [[ ${LOGIN_RETURN_CODE} == 200 ]]; then
      echo "$DATE - Successfully logged into Octopus" >>/tmp/octopus-rtmp.log
    else
      echo "$DATE - Error while re-auth. Returned: $LOGIN_RETURN_CODE" >>/tmp/octopus-rtmp.log  
    fi
  else
    echo "$DATE - Authentication failed with the status code: $AUTH_STATUS_CODE." >>/tmp/octopus-rtmp.log
  fi
  AUTH_TOKEN=$(echo ${RESPONSE} | jq -r '.accessToken')
  REFRESH_TOKEN=$(echo ${RESPONSE} | jq -r '.refreshToken')
  #Overwriting previous tokens
  echo "AUTH_TOKEN=$AUTH_TOKEN" >/config/token.txt
  echo "REFRESH_TOKEN=$REFRESH_TOKEN" >>/config/token.txt
  #Logging new tokens
  echo "$DATE - Auth Token: $AUTH_TOKEN" >>/tmp/octopus-rtmp.log
  echo "$DATE - Refresh Token: $REFRESH_TOKEN" >>/tmp/octopus-rtmp.log
}

send_event() {
  HEADER="Bearer $AUTH_TOKEN"
  if [[ $EVENT_TYPE == record-done ]]
    then
    upload
    echo "$DATE - Sending Recording Event: id: $FILE_ID and filename is: $FILENAME" >>/tmp/octopus-rtmp.log
    RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -H "Authorization: $HEADER" -d '{"id": "'"$FILE_ID"'", "type": "meeting-recording", "fileName": "'"$FILENAME"'"}' ${OCTOPUS_URL}/v1/video/client/feedback)
  else
    echo "$DATE - Sending Streaming Event: slug: $VIDEO_ID and userID is: $USER_ID" >>/tmp/octopus-rtmp.log
    RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -H "Authorization: $HEADER" -d '{"event": "'"$EVENT_TYPE"'", "mediaType": "video", "slug": "'"$VIDEO_ID"'", "userId": '$USER_ID'}' ${OCTOPUS_URL}/v1/stream/client/event)
  fi
  SEND_EVENT_RETURN_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
  if [[ $RESPONSE == OK || $RESPONSE == Created ]]
   then
    echo "$DATE - Event successfully sent to Octopus with response: $SEND_EVENT_RETURN_CODE" >>/tmp/octopus-rtmp.log
  else
    if [[ $NUMBER_OF_TRIES -lt $MAX_EVENT_TRIES ]]
     then
      NUMBER_OF_TRIES=$((NUMBER_OF_TRIES+1))
      echo "$DATE - Error while sending event. Retuned code: ${SEND_EVENT_RETURN_CODE}. Num of tries: $NUMBER_OF_TRIES." >>/tmp/octopus-rtmp.log
      auth
      send_event      
    else
      echo "$DATE - Error while sending event after trying $NUMBER_OF_TRIES times. Retuned code: ${SEND_EVENT_RETURN_CODE}" >>/tmp/octopus-rtmp.log
    fi
  fi
}

send_event