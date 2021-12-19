#!/bin/bash

DATE="$(date)"
# AWS credentials
AWS_ACCESS_KEY=$AWS_ACCESS_KEY
AWS_SECRET_KEY=$AWS_SECRET_KEY
AWS_DEFAULT_REGION=$AWS_REGION
S3_BUCKET_NAME=$AWS_BUCKET
FINAL_STATUS=null
RECORDINGS_DIR=$1
echo "Uploading the recording to S3 Recording... Dir $1" 
# Get the folder name
RECORDINGS=`ls $RECORDINGS_DIR/*.mp4`
RECORDINGS=`basename $RECORDINGS`
FOLDER_NAME=$(echo $RECORDINGS | tr "_" "\n")
echo "S3 Parameters: $FOLDER_NAME" 
echo "Recordings: $RECORDINGS" 
for name in $FOLDER_NAME
do
FOLDER_NAME=$name
break
done
echo "Starting Upload of file: $name" 

upload(){
# Set credentials for aws cli
aws configure set aws_access_key_id $AWS_ACCESS_KEY
aws configure set aws_secret_access_key $AWS_SECRET_KEY
aws configure set default.region $AWS_DEFAULT_REGION
# Upload to S3
aws s3 sync $RECORDINGS_DIR s3://$S3_BUCKET_NAME/meeting-recordings/$FOLDER_NAME/
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
   echo "AUTH_TOKEN=$AUTH_TOKEN" > ./token.txt
   echo "REFRESH_TOKEN=$REFRESH_TOKEN" >> ./token.txt
  fi
else
  echo "$DATE --- Refresh Successful. Receiving New Tokens..." 
  AUTH_TOKEN=$(echo ${RESPONSE} | jq -r '.accessToken')
  REFRESH_TOKEN=$(echo ${RESPONSE} | jq -r '.refreshToken')
  echo "AUTH_TOKEN=$AUTH_TOKEN" > ./token.txt
  echo "REFRESH_TOKEN=$REFRESH_TOKEN" >> ./token.txt
fi
}

send_event(){
 HEADER="Bearer $AUTH_TOKEN"
 echo "$DATE --- Request made with the payload: id: $FOLDER_NAME fileName: $RECORDINGS" 
 RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -H "Authorization: $HEADER" -d '{"id": "'"$FOLDER_NAME"'", "type": "meeting-recording", "fileName": "'"$RECORDINGS"'"}' ${OCTOPUS_URL}video/client/feedback)
 echo "$DATE --- Response is: $RESPONSE" 
 if [[ $RESPONSE != OK || $RESPONSE != Created ]]; then
 STATUS_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
 fi
 if [[ ${STATUS_CODE} == 401 || ${STATUS_CODE} == 403 || ${STATUS_CODE} == 400 ]]; then
   echo "$DATE --- Error While Sending Event Information. STATUS CODE: ${STATUS_CODE}" 
   FINAL_STATUS=$STATUS_CODE
 fi
}

upload
echo "Upload of file:  $name finished" 
send_event
echo "Final status  is: $FINAL_STATUS"  
if [ -z "$FINAL_STATUS" ]; then
 echo "$DATE --- Event Sent Successfully" 
else
 echo "$DATE --- Couldn't Send Event. Trying to Refresh Tokens." 
 refresh_octopus
 send_event
 if [ -z "$FINAL_STATUS" ]; then
  echo "$DATE --- Event Sent Successfully" 
 else
  echo "$DATE --- Error While Sending Event Information: $FINAL_STATUS" 
 fi
fi
