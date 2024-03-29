#!/bin/bash

DATE="$(date)"
source token.txt
source purpie-sh.conf
EVENT_TYPE=$1
TEMP_ID=$2
USER_ID=$(cut -d "=" -f2- <<<$TEMP_ID)
VIDEO_ID=$4
FILE_ID=$VIDEO_ID
FILENAME=$6
NUM_SEND_EVENT_TRIES=0
MAX_EVENT_TRIES=3

# AWS credentials
AWS_ACCESS_KEY=$YOUR_AWS_ACCESS_KEY
AWS_SECRET_KEY=$YOUR_AWS_SECRET_KEY
AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION
S3_BUCKET_NAME=$S3_BUCKET_NAME

echo "### $DATE - Reporting Event to Purpie ###" >>/tmp/purpie-rtmp.log
echo "$DATE - Event Type: $EVENT_TYPE - User ID: $USER_ID - Video ID: $VIDEO_ID" >>/tmp/purpie-rtmp.log

upload() {
  # Set credentials for aws cli
  aws configure set aws_access_key_id $AWS_ACCESS_KEY
  aws configure set aws_secret_access_key $AWS_SECRET_KEY
  aws configure set default.region $AWS_DEFAULT_REGION
  # Upload to S3
  aws s3 sync /home/recordings/$FILE_ID s3://$S3_BUCKET_NAME/meeting-recordings/$FILE_ID/
  S3_EXIT_CODE=$(echo $?)
  if [[ ${S3_EXIT_CODE} == 0 ]]
    echo "/home/recordings/$FILE_ID successfully synced with $S3_BUCKET_NAME/meeting-recordings/$FOLDER_NAME/" >>/tmp/purpie-rtmp.log
  else
    echo "/home/recordings/$FILE_ID failed to sync with $S3_BUCKET_NAME/meeting-recordings/$FOLDER_NAME/. Status Code: $S3_EXIT_CODE" >>/tmp/purpie-rtmp.log
  fi
}

auth() {
  echo "$DATE - Authentication Token Expired. Attempting to Use Refresh Token." >>/tmp/purpie-rtmp.log
  RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -d '{"refreshToken": "'"$REFRESH_TOKEN"'"}' ${PURPIE_URL}auth/client/refresh-token)
  AUTH_STATUS_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
  if [[ ${AUTH_STATUS_CODE} == 200 ]]; then
    echo "$DATE - Auth token successfully renewed" >>/tmp/purpie-rtmp.log
  elif [[ ${AUTH_STATUS_CODE} == 401 || ${AUTH_STATUS_CODE} == 403 || ${AUTH_STATUS_CODE} == 400 ]]; then
    echo "$DATE - Refresh Token has expired. Re-authing to Purpie..." >>/tmp/purpie-rtmp.log
    RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -d '{"apiKey": "'"$API_KEY"'", "apiSecret": "'"$API_SECRET"'"}' ${PURPIE_URL}auth/client/login)
    LOGIN_RETURN_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
    if [[ ${LOGIN_RETURN_CODE} == 200 ]]; then
      echo "$DATE - Successfully logged into Purpie" >>/tmp/purpie-rtmp.log
    else
      echo "$DATE - Error while re-auth. Returned: $LOGIN_RETURN_CODE" >>/tmp/purpie-rtmp.log  
    fi
  else
    echo "$DATE - Authentication failed with the status code: $AUTH_STATUS_CODE." >>/tmp/purpie-rtmp.log
  fi
  AUTH_TOKEN=$(echo ${RESPONSE} | jq -r '.accessToken')
  REFRESH_TOKEN=$(echo ${RESPONSE} | jq -r '.refreshToken')
  #Overwriting previous tokens
  echo "AUTH_TOKEN=$AUTH_TOKEN" >token.txt
  echo "REFRESH_TOKEN=$REFRESH_TOKEN" >>token.txt
  #Logging new tokens
  echo "$DATE - Auth Token: $AUTH_TOKEN" >>/tmp/purpie-rtmp.log
  echo "$DATE - Refresh Token: $REFRESH_TOKEN" >>/tmp/purpie-rtmp.log
}

send_event() {
  HEADER="Bearer $AUTH_TOKEN"
  if [[ $EVENT_TYPE == record-done ]]
    upload
    echo "$DATE - Sending Recording Event: id: $FILE_ID and filename is: $FILENAME" >>/tmp/purpie-rtmp.log
    RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -H "Authorization: $HEADER" -d '{"id": "'"$FILE_ID"'", "type": "meeting-recording", "fileName": "'"$FILENAME"'"}' ${PURPIE_URL}video/client/feedback)
  else
    echo "$DATE - Sending Streaming Event: slug: $VIDEO_ID and userID is: $USER_ID" >>/tmp/purpie-rtmp.log
    RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -H "Authorization: $HEADER" -d '{"event": "'"$EVENT_TYPE"'", "mediaType": "video", "slug": "'"$VIDEO_ID"'", "userId": '$USER_ID'}' ${PURPIE_URL}stream/client/event)
  fi
  SEND_EVENT_RETURN_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
  if [[ $RESPONSE == OK || $RESPONSE == Created ]]; then
    echo "$DATE - Event successfully sent to Purpie with response: $RESPONSE" >>/tmp/purpie-rtmp.log
else
    if [[ $NUMBER_OF_TRIES -lt $MAX_EVENT_TRIES ]]
     then
      NUMBER_OF_TRIES=$((NUMBER_OF_TRIES+1))
      echo "$DATE - Error while sending event. Retuned code: ${SEND_EVENT_RETURN_CODE}. Response is $RESPONSE. Num of tries: $NUMBER_OF_TRIES." >> /tmp/purpie-rtmp.log
      if [[ $SEND_EVENT_RETURN_CODE == 401 ]]
       then
        auth
      fi
      send_event
    else
      echo "$DATE - Error while sending event after trying $NUMBER_OF_TRIES times. Retuned code: ${SEND_EVENT_RETURN_CODE}" >> /tmp/purpie-rtmp.log
    fi
  fi
}

send_event
