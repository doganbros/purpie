import dayjs from 'dayjs';
import { Anchor, Box, Text } from 'grommet';
import React, { FC } from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { useSelector } from 'react-redux';
import { ChatMessage } from '../../store/types/chat.types';
import InitialsAvatar from '../utils/InitialsAvatar';
import { AppState } from '../../store/reducers/root.reducer';
import {
  LeftShadowBox,
  RightShadowBox,
  UserFullName,
} from './MessageItem.styled';

interface Props {
  message: ChatMessage;
  id?: number;
  menuItems?: { label: string; onClick: () => void }[] | null;
}

const MessageItem: FC<Props> = ({ id, message, children, menuItems }) => {
  const {
    auth: { user: currentUser },
  } = useSelector((state: AppState) => state);
  const ownMessage = message.createdBy.id === currentUser?.id;

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
            key={item.label}
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

  const ContentBox = ownMessage ? RightShadowBox : LeftShadowBox;
  return (
    <>
      {renderContextMenu()}
      <Box width="95%">
        <ContextMenuTrigger
          id={`message_${message.id}`}
          disableIfShiftIsPressed
          holdToDisplay={-1}
        >
          <ContentBox
            direction={ownMessage ? 'row-reverse' : 'row'}
            id={`message-item-${message.identifier}`}
            justify="start"
            alignContent="end"
            gap="small"
            margin="small"
            pad={{ top: 'medium' }}
            round="small"
            elevation={ownMessage ? 'right' : 'left'}
          >
            <Box
              margin={{ [ownMessage ? 'right' : 'left']: '-15.5px' }}
              pad="1px"
              height="42px"
              width={ownMessage ? '42px' : '48px'}
              round="xlarge"
              border={{ color: '#E4E9F2', size: 'small' }}
            >
              <InitialsAvatar
                size="medium"
                fontSize="small"
                id={message.createdBy.id}
                value={`${message.createdBy.firstName} ${message.createdBy.lastName} `}
              />
            </Box>
            <Box
              direction="column"
              justify="end"
              margin={{ right: 'small' }}
              width={{ width: ownMessage ? '50%' : '100%' }}
            >
              <Box direction="row" justify={ownMessage ? 'end' : 'start'}>
                <Box direction="row">
                  <UserFullName
                    size="small"
                    margin={{ right: 'xsmall' }}
                    weight="bold"
                    textAlign={ownMessage ? 'end' : 'start'}
                  >
                    {ownMessage
                      ? 'You'
                      : `${message.createdBy.firstName} ${message.createdBy.lastName}`}
                  </UserFullName>
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
                  textAlign={ownMessage ? 'end' : 'start'}
                >
                  {message.deleted
                    ? 'This message has been deleted'
                    : message.message}
                </Text>
                {message.edited ? <Text size="xsmall">(edited)</Text> : null}
                {children}
              </Box>
            </Box>
          </ContentBox>
        </ContextMenuTrigger>
      </Box>
    </>
  );
};

export default MessageItem;
