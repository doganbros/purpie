import dayjs from 'dayjs';
import { Anchor, Box, Text } from 'grommet';
import React, { FC } from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { ChatMessage } from '../../store/types/chat.types';
import InitialsAvatar from '../utils/InitialsAvatar';

interface Props {
  message: ChatMessage;
  id?: number;
  side?: 'right' | 'left';
  menuItems?: { label: string; onClick: () => void }[] | null;
}

const MessageItem: FC<Props> = ({ id, message, side, children, menuItems }) => {
  const renderContextMenu = () => (
    <ContextMenu id={`message_${id}`} preventHideOnContextMenu>
      <Box
        border={{ color: 'rgba(0,0,0,0.02)', size: 'small' }}
        background="white"
        round="small"
        elevation="right"
      >
        {menuItems?.map((item: { label: string; onClick: () => void }) => (
          <Box
            onClick={() => {}}
            pad={{ horizontal: 'small', vertical: 'xsmall' }}
            hoverIndicator={{ background: '#8F9BB3' }}
          >
            <MenuItem onClick={item.onClick}>{item.label}</MenuItem>
          </Box>
        ))}
      </Box>
    </ContextMenu>
  );

  return (
    <>
      {renderContextMenu()}
      <ContextMenuTrigger
        id={`message_${id}`}
        disableIfShiftIsPressed
        holdToDisplay={-1}
      >
        <Box
          direction={message.to === id ? 'row-reverse' : 'row'}
          id={`message-item-${message.identifier}`}
          justify={side === 'right' ? 'end' : 'start'}
          alignContent="end"
          gap="small"
          margin="small"
          pad={{ top: 'medium' }}
          round="small"
          elevation={message.to === id ? 'right' : 'left'}
        >
          <Box
            margin={{ [message.to === id ? 'right' : 'left']: '-15.5px' }}
            pad="1px"
            height="42px"
            width="48px"
            round="xlarge"
            border={{ color: '#E4E9F2', size: 'small' }}
          >
            <InitialsAvatar
              size="36px"
              fontSize="small"
              id={message.createdBy.id}
              value={`${message.createdBy.firstName} ${message.createdBy.lastName} `}
            />
          </Box>
          <Box
            direction="column"
            justify="end"
            margin={{ right: 'small' }}
            width={{ width: message.to === id ? '50%' : '100%' }}
          >
            <Box direction="row" justify={message.to === id ? 'end' : 'start'}>
              <Box direction="row">
                <Text
                  size="small"
                  margin={{ right: 'xsmall' }}
                  weight="bold"
                  textAlign={message.to === id ? 'end' : 'start'}
                >
                  {message.createdBy.firstName} {message.createdBy.lastName}
                </Text>
                <Text size="small">
                  {dayjs(message.createdOn).format('hh:mm:a')}
                </Text>
              </Box>
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
              <Text
                size="small"
                margin={{ right: 'xsmall' }}
                textAlign={message.to === id ? 'end' : 'start'}
              >
                {message.deleted
                  ? 'This message has been deleted'
                  : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
              </Text>
              {message.edited ? <Text size="xsmall">(edited)</Text> : null}
              {children}
            </Box>
          </Box>
        </Box>
      </ContextMenuTrigger>
    </>
  );
};

export default MessageItem;
