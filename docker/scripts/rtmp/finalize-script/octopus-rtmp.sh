#!/bin/bash

if ! command -v aws &> /dev/null
then
    echo "Installing AWS"
    apt-get install awscli -y
fi

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

upload(){
# Set credentials for aws cli
aws configure set aws_access_key_id $AWS_ACCESS_KEY
aws configure set aws_secret_access_key $AWS_SECRET_KEY
aws configure set default.region $AWS_DEFAULT_REGION
# Upload to S3
aws s3 sync /home/recordings/$FILE_ID s3://$S3_BUCKET_NAME/meeting-recordings/$FILE_ID/
}

refresh_octopus(){
  echo "$DATE --- Authentication Token Expired. Attempting to Use Refresh Token." 
RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -d '{"refreshToken": "'"$REFRESH_TOKEN"'"}' ${OCTOPUS_URL}auth/client/refresh-token)
STATUS_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
if [[ ${STATUS_CODE} == 401 || ${STATUS_CODE} == 403 || ${STATUS_CODE} == 400 ]]
 then
  echo "$DATE --- Refresh Token has expired. Logging in to Octopus..." 
  RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -d '{"apiKey": "'"$OCTOPUS_API_KEY"'", "apiSecret": "'"$OCTOPUS_API_SECRET"'"}' ${OCTOPUS_URL}auth/client/login)
  STATUS_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
  if [ ${STATUS_CODE} == 401 ]; then
   echo "$DATE --- Error While Logging In: Not Authorized" 
  elif [ ${STATUS_CODE} == 400 ]; then
   echo "$DATE --- Error While Logging In: Bad Request" 
  else
  echo "$DATE --- Successfully Logged into Octopus. Receiving New Tokens..." 
   AUTH_TOKEN=$(echo ${RESPONSE} | jq -r '.accessToken')
   REFRESH_TOKEN=$(echo ${RESPONSE} | jq -r '.refreshToken')
   echo "AUTH_TOKEN=$AUTH_TOKEN" > token.txt
   echo "REFRESH_TOKEN=$REFRESH_TOKEN" >> token.txt
  fi
else
  echo "$DATE --- Refresh Successful. Receiving New Tokens..." 
  AUTH_TOKEN=$(echo ${RESPONSE} | jq -r '.accessToken')
  REFRESH_TOKEN=$(echo ${RESPONSE} | jq -r '.refreshToken')
  echo "AUTH_TOKEN=$AUTH_TOKEN" > token.txt
  echo "REFRESH_TOKEN=$REFRESH_TOKEN" >> token.txt
fi
}

send_streaming_event(){
 HEADER="Bearer $AUTH_TOKEN"
 echo "Sending Streaming Event: slug: $VIDEO_ID and userID is: $USER_ID URL: $OCTOPUS_URL" 
 RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -H "Authorization: $HEADER" -d '{"event": "'"$EVENT_TYPE"'", "mediaType": "video", "slug": "'"$VIDEO_ID"'", "userId": '$USER_ID'}' ${OCTOPUS_URL}stream/client/event)
 echo "Response from Streaming Event: $RESPONSE" 
 if [[ $RESPONSE != OK ]]; then
 STATUS_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
 fi
 if [[ ${STATUS_CODE} == 401 || ${STATUS_CODE} == 403 || ${STATUS_CODE} == 400 ]]; then
   echo "$DATE --- Error While Sending Streaming Event Information: $STATUS_CODE" 
   FINAL_STATUS_CODE=$STATUS_CODE
 fi
}

send_recording_event(){
 HEADER="Bearer $AUTH_TOKEN"
 echo "Sending Recording Event: id: $FILE_ID and filename is: $FILENAME URL: $OCTOPUS_URL"
 RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -H "Authorization: $HEADER" -d '{"id": "'"$FILE_ID"'", "type": "meeting-recording", "fileName": "'"$FILENAME"'"}' ${OCTOPUS_URL}video/client/feedback)
 if [[ $RESPONSE != OK || $RESPONSE != Created ]]; then
 echo "Recording Event Sent: $RESPONSE" 
 STATUS_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
 fi
 if [[ ${STATUS_CODE} == 401 || ${STATUS_CODE} == 403 || ${STATUS_CODE} == 400 ]]; then
   echo "$DATE --- Error While Sending Recording Event Information. STATUS CODE: $STATUS_CODE" 
   FINAL_STATUS_CODE=$STATUS_CODE
 fi
}

echo "$EVENT_TYPE" 
if [[ $EVENT_TYPE == record-done ]]; then
 upload
 send_recording_event
 if [[ ${FINAL_STATUS_CODE} == 401 || ${FINAL_STATUS_CODE} == 403 || ${FINAL_STATUS_CODE} == 400 ]]; then
  refresh_octopus
  send_recording_event
  if [[ ${FINAL_STATUS_CODE} == 401 || ${FINAL_STATUS_CODE} == 403 || ${FINAL_STATUS_CODE} == 400 ]]; then
   echo "$DATE --- Error While Sending Event Information. $STATUS_CODE" 
  else
   echo "$DATE --- Event Sent Successfully" 
  fi
 fi
else
 send_streaming_event
 if [[ ${FINAL_STATUS_CODE} == 401 || ${FINAL_STATUS_CODE} == 403 || ${FINAL_STATUS_CODE} == 400 ]]; then
  refresh_octopus
  send_streaming_event
  if [[ ${FINAL_STATUS_CODE} == 401 || ${FINAL_STATUS_CODE} == 403 || ${FINAL_STATUS_CODE} == 400 ]]; then
   echo "$DATE --- Error While Sending Event Information. $STATUS_CODE" 
  else
   echo "$DATE --- Event Sent Successfully" 
  fi
 fi
fi
