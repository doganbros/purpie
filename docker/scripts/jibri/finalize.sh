#!/bin/bash

echo "" >> /config/token.txt
source /config/token.txt

MAX_EVENT_TRIES=$((3))
NUMBER_OF_TRIES=$((0))

strpos() { 
  haystack=$1
  needle=${2//\*/\\*}
  x="${haystack%%$needle*}"
  [[ "$x" = "$haystack" ]] && echo -1 || echo "${#x}"
}

DATE="$(date)"
# AWS credentials
FINAL_STATUS=null
RECORDINGS_DIR=$1

echo "Uploading the recording to S3 Recording... Dir $1" 
# Get the folder name
RECORDINGS=`ls $RECORDINGS_DIR/*.mp4`
RECORDINGS=`basename $RECORDINGS`

MEETING_URL=`cat $RECORDINGS_DIR/metadata.json | jq -r '.meeting_url'`
MEETING_NAME="${MEETING_URL##*\/}"




pos=$(strpos $MEETING_NAME _)

if [[ $pos -ge 0 ]]
then
    OCTOPUS_URL="https://${MEETING_NAME:$((pos + 1))}"
fi

upload() {
  echo "$DATE - Uploading recording files from: $RECORDINGS_DIR to S3 bucket: $S3_BUCKET_NAME/meeting-recordings/$MEETING_NAME/"
  # Set credentials for aws cli
  aws configure set aws_access_key_id $AWS_ACCESS_KEY
  aws configure set aws_secret_access_key $AWS_SECRET_KEY
  aws configure set default.region $AWS_DEFAULT_REGION
  # Upload to S3
  aws s3 sync $RECORDINGS_DIR s3://$S3_BUCKET_NAME/meeting-recordings/$MEETING_NAME/
  #TODO: CONFIRM THIS IS WORKING
  S3_EXIT_CODE=$(echo $?)
  if [[ ${S3_EXIT_CODE} == 0 ]]
  then
    echo "$RECORDINGS_DIR successfully synced with $S3_BUCKET_NAME/meeting-recordings/$MEETING_NAME/"
  else
    echo "$RECORDINGS_DIR failed to sync with $S3_BUCKET_NAME/meeting-recordings/$MEETING_NAME/. Status Code: $S3_EXIT_CODE"
  fi
}

auth() {
  echo "$DATE - Authentication token expired. Attempting to use Refresh Token."
  RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -d '{"refreshToken": "'"$REFRESH_TOKEN"'"}' ${OCTOPUS_URL}/v1/auth/client/refresh-token)
  AUTH_RETURN_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
  if [[ ${AUTH_RETURN_CODE} == 200 ]]; then
    echo "Auth token successfully renewed"
  elif [[ ${AUTH_RETURN_CODE} == 401 || ${AUTH_RETURN_CODE} == 403 || ${AUTH_RETURN_CODE} == 400 ]]; then
    echo "$DATE - Refresh Token has expired. Re-authing to Octopus..."
    RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -d '{"apiKey": "'"$API_KEY"'", "apiSecret": "'"$API_SECRET"'"}' ${OCTOPUS_URL}/v1/auth/client/login)
    LOGIN_RETURN_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
    if [[ ${LOGIN_RETURN_CODE} == 200 ]]; then
      echo "Successfully logged into Octopus"
    else
      echo "$DATE - Error while re-auth. Returned: $LOGIN_RETURN_CODE"  
    fi
  else
    echo "$DATE - Authentication failed with the status code: $AUTH_RETURN_CODE."
  fi
  AUTH_TOKEN=$(echo ${RESPONSE} | jq -r '.accessToken')
  REFRESH_TOKEN=$(echo ${RESPONSE} | jq -r '.refreshToken')
  #Overwriting previous tokens
  echo "AUTH_TOKEN=$AUTH_TOKEN" >/config/token.txt
  echo "REFRESH_TOKEN=$REFRESH_TOKEN" >>/config/token.txt
  #Logging new tokens
  echo "$DATE - Auth Token: $AUTH_TOKEN"
  echo "$DATE - Refresh Token: $REFRESH_TOKEN"
}

send_event() {
  HEADER="Bearer $AUTH_TOKEN"
  echo "$DATE - Sending event to Octopus. Payload data is id: $MEETING_NAME fileName: $RECORDINGS"
  RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -H "Authorization: $HEADER" -d '{"id": "'"$MEETING_NAME"'", "type": "meeting-recording", "fileName": "'"$RECORDINGS"'"}' ${OCTOPUS_URL}/v1/video/client/feedback)
  echo "$DATE - Got send event response : $RESPONSE"
  SEND_EVENT_RETURN_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
  #TO DO: UPDATE OCTOPUS BACKEND TO SUCCESS AND FAIL AND UPDATE HERE ACCORDINGLY
  if [[ $RESPONSE == OK || $RESPONSE == Created ]]; then
    echo "$DATE - Event successfully sent to Octopus with response: $SEND_EVENT_RETURN_CODE"
    NUMBER_OF_TRIES=$((0))
  else
    if [[ $NUMBER_OF_TRIES -lt $MAX_EVENT_TRIES ]]; then
      NUMBER_OF_TRIES=$((NUMBER_OF_TRIES+1))
      echo "$DATE - Error while sending event. Retuned code: ${SEND_EVENT_RETURN_CODE}. Num of tries: $NUMBER_OF_TRIES."
      auth
      send_event      
    else
      echo "$DATE - Error while sending event after trying $NUMBER_OF_TRIES times. Retuned code: ${SEND_EVENT_RETURN_CODE}"
    fi
  fi
}

upload
send_event