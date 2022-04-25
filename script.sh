

if [[ ${S3_EXIT_CODE} == 0 ]] then
    echo "$RECORDINGS_DIR successfully synced with $S3_BUCKET_NAME/meeting-recordings/$FOLDER_NAME/"
  else
    echo "$RECORDINGS_DIR failed to sync with $S3_BUCKET_NAME/meeting-recordings/$FOLDER_NAME/. Status Code: $S3_EXIT_CODE"
  fi