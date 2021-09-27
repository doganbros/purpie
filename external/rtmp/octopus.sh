#!/bin/bash

DATE="$(date)"
source token.txt
source octopus.conf
EVENT_TYPE=$1
TEMP_ID=$2
USER_ID=$(cut -d "=" -f2-<<< $TEMP_ID)
VIDEO_ID=$4

echo "#################################### $DATE --- Reporting Event to Octopus #########################################################" >> /tmp/octopus-rtmp.log
echo "$DATE --- Event Type: $EVENT_TYPE - User ID: $USER_ID - Video ID: $VIDEO_ID" >> /tmp/octopus-rtmp.log

refresh_octopus(){
  echo "$DATE --- Authentication Token Expired. Attempting to Use Refresh Token." >> /tmp/octopus-rtmp.log
RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -d '{"refreshToken": "'"$REFRESH_TOKEN"'"}' ${OCTOPUS_URL}auth/client/refresh-token)
STATUS_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
if [[ ${STATUS_CODE} == 401 || ${STATUS_CODE} == 403 || ${STATUS_CODE} == 400 ]]
 then
  echo "$DATE --- Refresh Token has expired. Logging in to Octopus..." >> /tmp/octopus-rtmp.log
  RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -d '{"apiKey": "'"$API_KEY"'", "apiSecret": "'"$API_SECRET"'"}' ${OCTOPUS_URL}auth/client/login)
  STATUS_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
  if [ ${STATUS_CODE} == 401 ]; then
   echo "$DATE --- Error While Logging In: Not Authorized" >> /tmp/octopus-rtmp.log
  elif [ ${STATUS_CODE} == 400 ]; then
   echo "$DATE --- Error While Logging In: Bad Request" >> /tmp/octopus-rtmp.log
  else
  echo "$DATE --- Successfully Logged into Octopus. Receiving New Tokens..." >> /tmp/octopus-rtmp.log
   AUTH_TOKEN=$(echo ${RESPONSE} | jq -r '.accessToken')
   REFRESH_TOKEN=$(echo ${RESPONSE} | jq -r '.refreshToken')
   echo "AUTH_TOKEN=$AUTH_TOKEN" > token.txt
   echo "REFRESH_TOKEN=$REFRESH_TOKEN" >> token.txt
  fi
else
  echo "$DATE --- Refresh Successful. Receiving New Tokens..." >> /tmp/octopus-rtmp.log
  AUTH_TOKEN=$(echo ${RESPONSE} | jq -r '.accessToken')
  REFRESH_TOKEN=$(echo ${RESPONSE} | jq -r '.refreshToken')
  echo "AUTH_TOKEN=$AUTH_TOKEN" > token.txt
  echo "REFRESH_TOKEN=$REFRESH_TOKEN" >> token.txt
fi
}


send_event(){
 HEADER="Bearer $AUTH_TOKEN"
 RESPONSE=$(curl --silent -X POST -H "Content-Type: application/json" -H "Authorization: $HEADER" -d '{"event": "'"$EVENT_TYPE"'", "mediaType": "video", "slug": "'"$VIDEO_ID"'", "userId": '$USER_ID'}' ${OCTOPUS_URL}stream/client/event)
 if [[ $RESPONSE != OK ]]; then
 STATUS_CODE=$(echo ${RESPONSE} | jq -r '.statusCode')
 fi
 if [[ ${STATUS_CODE} == 401 || ${STATUS_CODE} == 403 || ${STATUS_CODE} == 400 ]]; then
   echo "$DATE --- Error While Sending Event Information"
   return $STATUS_CODE
 fi
}

send_event
if [ -z "$STATUS_CODE" ]; then
 echo "$DATE --- Event Sent Successfully" >> /tmp/octopus-rtmp.log
else
 echo "$DATE --- Couldn't Send Event. Trying to Refresh Tokens." >> /tmp/octopus-rtmp.log
 refresh_octopus
 send_event
 if [ -z "$STATUS_CODE" ]; then
  echo "$DATE --- Event Sent Successfully" >> /tmp/octopus-rtmp.log
 else
  echo "$DATE --- Error While Sending Event Information" >> /tmp/octopus-rtmp.log
 fi
fi
