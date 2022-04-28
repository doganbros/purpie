import dayjs from 'dayjs';
import { Anchor, Box, Text } from 'grommet';
import React, { FC } from 'react';
import { ChatMessage } from '../../store/types/chat.types';
import InitialsAvatar from '../utils/InitialsAvatar';

interface Props {
  message: ChatMessage;
  side?: 'right' | 'left';
  actions?: React.ReactNode | null;
}

const MessageItem: FC<Props> = ({ message, side, children, actions }) => {
  return (
    <Box
      direction="row"
      id={`message-item-${message.identifier}`}
      justify={side === 'right' ? 'end' : 'start'}
      alignContent="end"
      gap="small"
      margin="small"
      width="100%"
      pad={{ top: 'medium' }}
    >
      <InitialsAvatar
        id={message.createdBy.id}
        value={`${message.createdBy.firstName} ${message.createdBy.lastName} `}
      />
      <Box direction="column" width={{ min: '300px', width: '50%' }}>
        <Box direction="row" justify="between" align="center">
          <Box direction="row">
            <Text size="small" margin={{ right: 'xsmall' }} weight="bold">
              {message.createdBy.firstName} {message.createdBy.lastName}
            </Text>
            <Text size="small">
              {dayjs(message.createdOn).format('hh:mm:a')}
            </Text>
          </Box>
          {actions}
        </Box>
        <Box>
          {message.parent ? (
            <Text size="xsmall" margin={{ bottom: 'xsmall' }}>
              <Text size="xsmall" as="i" margin={{ right: 'xsmall' }}>
                Replied to:
              </Text>
              <Anchor href={`#message-item-${message.parent.identifier}`}>
                {message.parent.message}
              </Anchor>
            </Text>
          ) : null}
          {message.deleted ? 'This message has been deleted' : message.message}
          {message.edited ? <Text size="xsmall">(edited)</Text> : null}
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MessageItem;
