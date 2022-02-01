#!/bin/bash

DATE="$(date)"
source /home/finalize/token.txt
source /home/finalize/octopus-finalize.conf
# AWS credentials
AWS_ACCESS_KEY=$AWS_ACCESS_KEY
AWS_SECRET_KEY=$AWS_SECRET_KEY
AWS_DEFAULT_REGION=$AWS_REGION
S3_BUCKET_NAME=$AWS_BUCKET
SEND_EVENT_RETURN_CODE=null
AUTH_RETURN_CODE=null

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
  # TODO: Get the returned value from AWS CLI and inform Octopus about the upload
}

auth() {
  echo "$DATE - Authentication token expired. Attempting to use Refresh Token." >>/home/finalize/finalize.log
  RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -d '{"refreshToken": "'"$REFRESH_TOKEN"'"}' ${OCTOPUS_URL}auth/client/refresh-token)
  AUTH_RETURN_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')

  #TODO: TRANSFORM THE LOGIC BELOW TO "IF VALID CASE ELSEIF 403 ELSE BLOCK"

  if [[ ${AUTH_RETURN_CODE} == 401 || ${AUTH_RETURN_CODE} == 403 || ${AUTH_RETURN_CODE} == 400 ]]; then
    echo "$DATE --- Refresh Token has expired. Re-authing to Octopus..." >>/home/finalize/finalize.log
    RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -d '{"apiKey": "'"$API_KEY"'", "apiSecret": "'"$API_SECRET"'"}' ${OCTOPUS_URL}auth/client/login)
    AUTH_RETURN_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
    if [ ${AUTH_RETURN_CODE} == 403 ]; then
      echo "$DATE --- Successfully auth to Octopus." >>/home/finalize/finalize.log
      AUTH_TOKEN=$(echo ${RESPONSE} | jq -r '.accessToken')
      REFRESH_TOKEN=$(echo ${RESPONSE} | jq -r '.refreshToken')
      echo "$DATE --- Got new Auth Token: $AUTH_TOKEN" >/home/finalize/token.txt
      echo "$DATE --- Got new Refresh Token: $REFRESH_TOKEN" >>/home/finalize/token.txt
    else
      echo "$DATE --- Error while re-auth. Returned: $AUTH_RETURN_CODE" >>/home/finalize/finalize.log
    fi
  else
    echo "$DATE - Successfully auth to Octopus." >>/home/finalize/finalize.log
    AUTH_TOKEN=$(echo ${RESPONSE} | jq -r '.accessToken')
    REFRESH_TOKEN=$(echo ${RESPONSE} | jq -r '.refreshToken')
    echo "$DATE --- Got new Auth Token: $AUTH_TOKEN" >/home/finalize/token.txt
    echo "$DATE --- Got new Refresh Token: $REFRESH_TOKEN" >>/home/finalize/token.txt
  fi
}

send_event() {
  HEADER="Bearer $AUTH_TOKEN"
  echo "$DATE - Sending event to Octopus. Payload data is id: $FOLDER_NAME fileName: $RECORDINGS" >>/home/finalize/finalize.log
  RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -H "Authorization: $HEADER" -d '{"id": "'"$FOLDER_NAME"'", "type": "meeting-recording", "fileName": "'"$RECORDINGS"'"}' ${OCTOPUS_URL}video/client/feedback)
  echo "$DATE - Got send event response : $RESPONSE" >>/home/finalize/finalize.log
  #TO DO: UPDATE OCTOPUS BACKEND TO SUCCESS AND FAIL AND UPDATE HERE ACCORDINGLY
  if [[ $RESPONSE == OK || $RESPONSE == Created ]]; then
    echo "$DATE - Event sent to Octopus with response: $RESPONSE" >>/home/finalize/finalize.log
  else
    SEND_EVENT_RETURN_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
    if [[ ${SEND_EVENT_RETURN_CODE} == 401 || ${SEND_EVENT_RETURN_CODE} == 403 || ${SEND_EVENT_RETURN_CODE} == 400 ]]; then
      echo "$DATE --- Error while sending event. Retuned code: ${SEND_EVENT_RETURN_CODE}" >>/home/finalize/finalize.log
    fi
  fi
}

upload
echo "$DATE --- Uploading file:  $name is done." >>/home/finalize/finalize.log
send_event
echo "$DATE --- Final status  is: $SEND_EVENT_RETURN_CODE" >>/home/finalize/finalize.log
if [ -z "$SEND_EVENT_RETURN_CODE" ]; then
  echo "$DATE --- Event sent successfully" >>/home/finalize/finalize.log
else
  echo "$DATE --- Couldn't send event. Will re-auth." >>/home/finalize/finalize.log
  auth
  send_event
  if [ -z "$SEND_EVENT_RETURN_CODE" ]; then
    echo "$DATE --- Event sent successfully" >>/home/finalize/finalize.log
  else
    echo "$DATE --- Error while sending event. Returned code: $SEND_EVENT_RETURN_CODE" >>/home/finalize/finalize.log
  fi
fi
