import { Box } from 'grommet';
import React, { FC, useRef, useState } from 'react';
import { ChatMessage } from '../../../store/types/chat.types';
import { useThrottle } from '../../../hooks/useThrottle';
import InitialsAvatar from '../../utils/InitialsAvatar';
import { User } from '../../../store/types/auth.types';
import MessageFiles from './MessageFiles';
import MessageAttachments from './MessageAttachments';
import MessageTextArea from './MessageTextArea';

interface Props {
  name?: string;
  handleTypingEvent?: boolean;
  onTyping: () => void;
  user: User;
  onSubmit: (message: Partial<ChatMessage>) => void;
}

const TYPING_THROTTLE_INTERVAL = 700;

const MessageBox: FC<Props> = ({
  name,
  onSubmit,
  handleTypingEvent,
  onTyping,
  user,
}) => {
  const throttle = useThrottle();
  const componentRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [emojiPickerVisibility, setEmojiPickerVisibility] = useState(false);
  const [
    suggestionPickerVisibility,
    setSuggestionPickerVisibility,
  ] = useState<boolean>(false);
  const [
    mentionPickerVisibility,
    setMentionPickerVisibility,
  ] = useState<boolean>(false);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && e.currentTarget.value) {
      e.preventDefault();
      onSubmit({ message: e.currentTarget.value });
      setText('');
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
        {selectedFile && (
          <MessageFiles
            file={selectedFile}
            deleteFile={() => setSelectedFile(null)}
          />
        )}
        <MessageAttachments
          attachmentToolVisibility
          text={text}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          onSubmit={() => {
            onSubmit({ message: text });
            setText('');
          }}
          toggleEmojiPicker={() =>
            setEmojiPickerVisibility(!emojiPickerVisibility)
          }
          toggleMentionPicker={() =>
            setMentionPickerVisibility(!mentionPickerVisibility)
          }
        />
      </Box>
    </Box>
  );
};

export default MessageBox;
