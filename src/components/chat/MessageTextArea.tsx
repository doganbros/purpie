import { Box, Collapsible, Text, TextArea } from 'grommet';
import React, { FC, useState } from 'react';
import { ChatMessage } from '../../store/types/chat.types';
import { useThrottle } from '../../hooks/useThrottle';
import InitialsAvatar from '../utils/InitialsAvatar';
import { User } from '../../store/types/auth.types';

interface Props {
  name?: string;
  handleTypingEvent?: boolean;
  onTyping: () => void;
  user: User;
  onSubmit: (message: Partial<ChatMessage>) => void;
}

const TYPING_THROTTLE_INTERVAL = 700;

const MessageTextArea: FC<Props> = ({
  name,
  onSubmit,
  handleTypingEvent,
  onTyping,
  user,
}) => {
  const throttle = useThrottle();
  const [focused, setFocused] = useState(false);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && e.currentTarget.value) {
      e.preventDefault();
      onSubmit({ message: e.currentTarget.value });
      e.currentTarget.value = '';
      return null;
    }
    if (handleTypingEvent)
      return throttle(() => {
        onTyping();
      }, TYPING_THROTTLE_INTERVAL);
    return null;
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
        elevation="peach"
        pad={{ right: 'small' }}
        round="small"
        fill
        gap="small"
      >
        <TextArea
          plain
          resize={false}
          focusIndicator={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={`Write ${name ? `to ${name}` : 'your message...'} `}
          onKeyDown={(e) => onKeyDown(e)}
          style={{ overflow: 'none', height: 'auto' }}
        />
        <Collapsible open={focused} direction="vertical">
          <Text>Deneme</Text>
        </Collapsible>
      </Box>
    </Box>
  );
};

export default MessageTextArea;
