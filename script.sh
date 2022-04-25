MEETING_URL=`cat metadata.json | jq -r '.meeting_url'`
MEETING_NAME="${MEETING_URL##*\/}"

echo $MEETING_NAME