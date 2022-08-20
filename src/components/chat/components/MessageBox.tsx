import { Box, Button, Text } from 'grommet';
import React, { FC, useRef, useState } from 'react';
import { ChatMessage } from '../../../store/types/chat.types';
import { useThrottle } from '../../../hooks/useThrottle';
import InitialsAvatar from '../../utils/InitialsAvatar';
import { User } from '../../../store/types/auth.types';
import MessageFiles from './MessageFiles';
import MessageAttachments from './MessageAttachments';
import MessageTextArea from './MessageTextArea';
import { getFileKey } from '../../../helpers/utils';

interface Props {
  name?: string;
  handleTypingEvent?: boolean;
  onTyping: () => void;
  uploadingFiles: boolean;
  user: User;
  messageErrorDraft: null | {
    message: Partial<ChatMessage>;
    attachments?: Array<File>;
  };
  onSendAgain: () => void;
  onSubmit: (message: Partial<ChatMessage>, attachments: Array<File>) => void;
  attachments?: Array<File>;
  canAddFile?: boolean;
}

const TYPING_THROTTLE_INTERVAL = 700;

const MessageBox: FC<Props> = ({
  name,
  onSubmit,
  handleTypingEvent,
  uploadingFiles,
  onTyping,
  messageErrorDraft,
  onSendAgain,
  canAddFile,
  user,
}) => {
  const throttle = useThrottle();
  const componentRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>('');
  const [emojiPickerVisibility, setEmojiPickerVisibility] = useState(false);
  const [suggestionPickerVisibility, setSuggestionPickerVisibility] = useState(
    false
  );
  const [mentionPickerVisibility, setMentionPickerVisibility] = useState(false);
  const [attachments, setAttachments] = useState<Array<File>>([]);

  const onSend = (message: string) => {
    onSubmit({ message }, attachments);
    setText('');
    setAttachments([]);
    return null;
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && e.currentTarget.value) {
      e.preventDefault();
      onSend(e.currentTarget.value);
      return null;
    }
    if (handleTypingEvent) {
      return throttle(onTyping, TYPING_THROTTLE_INTERVAL);
    }
    return null;
  };

  return (
    <Box
      direction="row"
      align="center"
      ref={componentRef}
      margin={{ right: 'small', left: 'small' }}
    >
      {user && (
        <Box flex={{ shrink: 0 }}>
          <InitialsAvatar
            size="medium"
            id={user.id}
            value={`${user?.firstName} ${user?.lastName}`}
          />
        </Box>
      )}
      <Box
        elevation="indigo"
        margin={{ left: 'small' }}
        gap="small"
        round="small"
        direction="column"
        height="fit-content"
        width="100%"
      >
        <MessageTextArea
          name={name}
          onKeyDown={onKeyDown}
          setText={setText}
          text={text}
          emojiPickerVisibility={emojiPickerVisibility}
          setEmojiPickerVisibility={setEmojiPickerVisibility}
          setSuggestionPickerVisibility={setSuggestionPickerVisibility}
          setMentionPickerVisibility={setMentionPickerVisibility}
          suggestionPickerVisibility={suggestionPickerVisibility}
          componentRef={componentRef}
          mentionPickerVisibility={mentionPickerVisibility}
        />
        {canAddFile && attachments && (
          <MessageFiles
            files={attachments}
            onDeleteFile={(file) =>
              setAttachments((files) => files.filter((f) => f !== file))
            }
          />
        )}
        {uploadingFiles && <Text size="small">Uploading Files...</Text>}
        {messageErrorDraft ? (
          <Button
            label="Send Message Again"
            onClick={() => {
              onSendAgain();
            }}
          />
        ) : null}
        <MessageAttachments
          attachmentToolVisibility
          onFilesSelected={
            canAddFile
              ? (files) => {
                  const incomingFileKeys = files.map(getFileKey);

                  setAttachments((existingFiles) => [
                    ...existingFiles.filter(
                      (f) => !incomingFileKeys.includes(getFileKey(f))
                    ),
                    ...files,
                  ]);
                }
              : null
          }
          toggleEmojiPicker={() =>
            setEmojiPickerVisibility(!emojiPickerVisibility)
          }
          toggleMentionPicker={() =>
            setMentionPickerVisibility(!mentionPickerVisibility)
          }
          sendButton={
            <Box>
              {(text.length || !!attachments.length) && (
                <Button
                  size="small"
                  primary
                  label="Send"
                  onClick={() => {
                    onSend(text);
                  }}
                  margin={{ right: 'small', bottom: 'small' }}
                />
              )}
            </Box>
          }
        />
      </Box>
    </Box>
  );
};

export default MessageBox;
