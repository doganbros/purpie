import React, { FC } from 'react';
import { Box } from 'grommet';
import MessageItem from '../../../components/utils/MessageItem';
import { messages } from './data/messages';

const Messages: FC = () => (
  <Box pad={{ vertical: 'large', horizontal: 'medium' }} gap="large">
    {messages.map(({ avatarSrc, id: messageId, message, name, side }) => (
      <MessageItem
        key={messageId}
        avatarSrc={avatarSrc}
        message={message}
        name={name}
        side={side}
      />
    ))}
  </Box>
);

export default Messages;
