import { Box, Button } from 'grommet';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ChatMessage } from '../../../store/types/chat.types';
import { useThrottle } from '../../../hooks/useThrottle';
import InitialsAvatar from '../../utils/InitialsAvatar';
import { User } from '../../../store/types/auth.types';
import MessageFiles from './MessageFiles';
import MessageAttachments from './MessageAttachments';
import MessageTextArea from './MessageTextArea';
import { getFileKey } from '../../../helpers/utils';
import { SendButton, SendButtonContainer } from './ChatComponentsStyle';
import { searchProfileAction } from '../../../store/actions/user.action';
import { useTranslate } from '../../../hooks/useTranslate';

interface Props {
  name?: string;
  handleTypingEvent?: boolean;
  onTyping: () => void;
  uploadingFiles: Array<File>;
  uploadedFiles: string[];
  uploadErrors: string[];
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
  uploadedFiles,
  uploadErrors,
  onTyping,
  messageErrorDraft,
  onSendAgain,
  canAddFile,
  user,
}) => {
  const t = useTranslate('MessageBox');
  const throttle = useThrottle();
  const dispatch = useDispatch();
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
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
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
    } else {
      dispatch(searchProfileAction({ name: '', userContacts: false }));
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
          <InitialsAvatar size="medium" id={user.id} value={user.fullName} />
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
        {canAddFile && (
          <MessageFiles
            files={attachments}
            uploadingFiles={uploadingFiles}
            uploadedFiles={uploadedFiles}
            uploadErrors={uploadErrors}
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
        {messageErrorDraft ? (
          <Button
            label={t('sendAgain')}
            onClick={() => {
              onSendAgain();
            }}
          />
        ) : null}
        {attachmentToolVisibility && (
          <MessageAttachments
            onFilesSelected={onFileSelected}
            toggleEmojiPicker={toggleEmojiPicker}
            toggleMentionPicker={toggleMentionPicker}
            setAttachmentToolFocused={setAttachmentToolFocused}
            sendButton={
              <SendButtonContainer margin="small">
                {(text.length || !!attachments.length) && (
                  <SendButton
                    size="small"
                    primary
                    label={t('send', true)}
                    onClick={() => {
                      onSend(text);
                    }}
                  />
                )}
              </SendButtonContainer>
            }
          />
        )}
      </Box>
    </Box>
  );
};

export default MessageBox;
