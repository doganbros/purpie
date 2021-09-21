import React, { FC } from 'react';
import { Avatar, Box, Text } from 'grommet';

interface MessageItemProps {
  side: 'left' | 'right';
  avatarSrc: string;
  name: string;
  message: string;
}

const MessageItem: FC<MessageItemProps> = ({
  side,
  children,
  avatarSrc,
  name,
  message,
}) => (
  <Box direction={side === 'left' ? 'row' : 'row-reverse'} gap="small">
    <Avatar flex={{ shrink: 0 }} src={avatarSrc} />
    <Box align={side === 'left' ? 'start' : 'end'}>
      <Text textAlign={side === 'left' ? 'start' : 'end'} weight="bold">
        {name}
      </Text>
      <Text
        textAlign={side === 'left' ? 'start' : 'end'}
        size="small"
        color="status-disabled"
      >
        {message}
      </Text>
      {children}
    </Box>
  </Box>
);

export default MessageItem;
