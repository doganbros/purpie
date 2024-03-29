#!/bin/bash

DATE="$(date)"
source /home/finalize/token.txt
source /home/finalize/purpie-finalize.conf
# AWS credentials
AWS_ACCESS_KEY=$AWS_ACCESS_KEY
AWS_SECRET_KEY=$AWS_SECRET_KEY
AWS_DEFAULT_REGION=$AWS_REGION
S3_BUCKET_NAME=$AWS_BUCKET
SEND_EVENT_RETURN_CODE=null
AUTH_RETURN_CODE=null
NUM_SEND_EVENT_TRIES=0
MAX_SEND_EVENT_TRIES=3

RECORDINGS_DIR=$1
echo "$DATE - Starting to finalize meeting recording on directory: $1" >>/home/finalize/finalize.log
# List recordings
RECORDINGS=$(ls $RECORDINGS_DIR/*.mp4)
# Get basenames (file names)
RECORDING_FILES=$(basename $RECORDINGS)
# Trim date info from the file name which is meeting name
MEETING_NAMES=$(echo $RECORDING_FILES | tr "_" "\n")

# Single one is enough
for name in $MEETING_NAMES; do
  MEETING_NAME=$name
  break
done

echo "$DATE - Finalizing recording for meeting: $name " >>/home/finalize/finalize.log

upload() {
  echo "$DATE - Uploading recording files from: $RECORDINGS_DIR to S3 bucket: $S3_BUCKET_NAME/meeting-recordings/$FOLDER_NAME/" >>/home/finalize/finalize.log
  # Set credentials for aws cli
  aws configure set aws_access_key_id $AWS_ACCESS_KEY
  aws configure set aws_secret_access_key $AWS_SECRET_KEY
  aws configure set default.region $AWS_DEFAULT_REGION
  # Upload to S3
  aws s3 sync $RECORDINGS_DIR s3://$S3_BUCKET_NAME/meeting-recordings/$FOLDER_NAME/
  #TODO: CONFIRM THIS IS WORKING
  S3_EXIT_CODE=$(echo $?)
  if [[ ${S3_EXIT_CODE} == 0 ]]
    echo "$RECORDINGS_DIR successfully synced with $S3_BUCKET_NAME/meeting-recordings/$FOLDER_NAME/" >>/home/finalize/finalize.log
  else
    echo "$RECORDINGS_DIR failed to sync with $S3_BUCKET_NAME/meeting-recordings/$FOLDER_NAME/. Status Code: $S3_EXIT_CODE" >>/home/finalize/finalize.log
  fi
}

auth() {
  echo "$DATE - Authentication token expired. Attempting to use Refresh Token." >>/home/finalize/finalize.log
  RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -d '{"refreshToken": "'"$REFRESH_TOKEN"'"}' ${PURPIE_URL}auth/client/refresh-token)
  AUTH_RETURN_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
  if [[ ${AUTH_RETURN_CODE} == 200 ]]; then
    echo "Auth token successfully renewed" >>/home/finalize/finalize.log
  elif [[ ${AUTH_RETURN_CODE} == 401 || ${AUTH_RETURN_CODE} == 403 || ${AUTH_RETURN_CODE} == 400 ]]; then
    echo "$DATE - Refresh Token has expired. Re-authing to Purpie..." >>/home/finalize/finalize.log
    RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -d '{"apiKey": "'"$API_KEY"'", "apiSecret": "'"$API_SECRET"'"}' ${PU_URL}auth/client/login)
    LOGIN_RETURN_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
    if [[ ${LOGIN_RETURN_CODE} == 200 ]]; then
      echo "Successfully logged into Purpie" >>/home/finalize/finalize.log
    else
      echo "$DATE - Error while re-auth. Returned: $LOGIN_RETURN_CODE" >>/home/finalize/finalize.log  
    fi
  else
    echo "$DATE - Authentication failed with the status code: $AUTH_RETURN_CODE." >>/home/finalize/finalize.log
  fi
  AUTH_TOKEN=$(echo ${RESPONSE} | jq -r '.accessToken')
  REFRESH_TOKEN=$(echo ${RESPONSE} | jq -r '.refreshToken')
  #Overwriting previous tokens
  echo "AUTH_TOKEN=$AUTH_TOKEN" >/home/finalize/token.txt
  echo "REFRESH_TOKEN=$REFRESH_TOKEN" >>/home/finalize/token.txt
  #Logging new tokens
  echo "$DATE - Auth Token: $AUTH_TOKEN" >>/home/finalize/finalize.log
  echo "$DATE - Refresh Token: $REFRESH_TOKEN" >>/home/finalize/finalize.log
}

send_event() {
  HEADER="Bearer $AUTH_TOKEN"
  echo "$DATE - Sending event to Purpie. Payload data is id: $FOLDER_NAME fileName: $RECORDINGS" >>/home/finalize/finalize.log
  RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -H "Authorization: $HEADER" -d '{"id": "'"$FOLDER_NAME"'", "type": "meeting-recording", "fileName": "'"$RECORDINGS"'"}' ${PURPIE_URL}video/client/feedback)
  echo "$DATE - Got send event response : $RESPONSE" >>/home/finalize/finalize.log
  SEND_EVENT_RETURN_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
  #TO DO: UPDATE PURPIE BACKEND TO SUCCESS AND FAIL AND UPDATE HERE ACCORDINGLY
  if [[ $RESPONSE == OK || $RESPONSE == Created ]]; then
    echo "$DATE - Event successfully sent to Purpie with response: $SEND_EVENT_RETURN_CODE" >>/home/finalize/finalize.log
  else
    if [[ $NUM_SEND_EVENT_TRIES -lt $MAX_SEND_EVENT_TRIES ]]; then
      NUMBER_OF_TRIES=$((NUMBER_OF_TRIES+1))
      echo "$DATE - Error while sending event. Retuned code: ${SEND_EVENT_RETURN_CODE}. Num of tries: $NUM_SEND_EVENT_TRIES." >>/home/finalize/finalize.log
      auth
      send_event      
    else
      echo "$DATE - Error while sending event after trying $NUM_SEND_EVENT_TRIES times. Retuned code: ${SEND_EVENT_RETURN_CODE}" >>/home/finalize/finalize.log
    fi
  fi
}

upload
send_event
