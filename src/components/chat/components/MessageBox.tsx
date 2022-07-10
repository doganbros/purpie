import { Box, Button, Text } from 'grommet';
import React, { FC, useEffect, useRef, useState } from 'react';
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timer: { current: NodeJS.Timeout | null } = useRef(null);
  const [text, setText] = useState<string>('');
  const [emojiPickerVisibility, setEmojiPickerVisibility] = useState(false);
  const [suggestionPickerVisibility, setSuggestionPickerVisibility] = useState(
    false
  );
  const [mentionPickerVisibility, setMentionPickerVisibility] = useState(false);
  const [attachments, setAttachments] = useState<Array<File>>([]);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [attachmentToolVisibility, setAttachmentToolVisibility] = useState(
    false
  );
  const [attachmentToolFocused, setAttachmentToolFocused] = useState(false);
  useEffect(() => {
    return () => timer && clearTimeout(timer.current as NodeJS.Timeout);
  }, []);
  useEffect(() => {
    if (document.activeElement === inputRef.current) {
      setAttachmentToolVisibility(true);
      clearInterval(timer.current as NodeJS.Timeout);
    } else if (inputFocused) {
      setAttachmentToolVisibility(true);
      clearInterval(timer.current as NodeJS.Timeout);
    } else if (attachmentToolFocused) {
      setAttachmentToolVisibility(true);
      clearInterval(timer.current as NodeJS.Timeout);
    } else if (text.length > 0) {
      setAttachmentToolVisibility(true);
    } else {
      timer.current = setTimeout(() => setAttachmentToolVisibility(false), 350);
    }
  }, [document.activeElement, inputRef]);

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

  const onFileSelected = (files: File[]) => {
    if (canAddFile) {
      const incomingFileKeys = files.map(getFileKey);
      setAttachments((existingFiles) => [
        ...existingFiles.filter(
          (f) => !incomingFileKeys.includes(getFileKey(f))
        ),
        ...files,
      ]);
    }
  };

  const toggleEmojiPicker = () => {
    const newValue = !emojiPickerVisibility;
    if (!newValue) {
      inputRef.current?.focus();
    }
    setAttachmentToolFocused(newValue);
    setEmojiPickerVisibility(newValue);
  };

  const toggleMentionPicker = () => {
    const newValue = !mentionPickerVisibility;
    if (!newValue) inputRef.current?.focus();
    setAttachmentToolFocused(newValue);
    setMentionPickerVisibility(newValue);
  };

  return (
    <Box
      direction="row"
      align="center"
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
        {canAddFile && attachments && (
          <MessageFiles
            files={attachments}
            onDeleteFile={(file) =>
              setAttachments((files) => files.filter((f) => f !== file))
            }
          />
        )}
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
          textAreaRef={inputRef}
          componentRef={componentRef}
          mentionPickerVisibility={mentionPickerVisibility}
          setInputFocused={setInputFocused}
        />

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
          attachmentToolVisibility={attachmentToolVisibility}
          onFilesSelected={onFileSelected}
          toggleEmojiPicker={toggleEmojiPicker}
          toggleMentionPicker={toggleMentionPicker}
          setAttachmentToolFocused={setAttachmentToolFocused}
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
