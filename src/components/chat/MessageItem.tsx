import dayjs from 'dayjs';
import { Anchor, Box, Text } from 'grommet';
import React, { FC } from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ChatAttachment, ChatMessage } from '../../store/types/chat.types';
import { AppState } from '../../store/reducers/root.reducer';
import {
  LeftShadowBox,
  RightShadowBox,
  UserFullName,
} from './MessageItem.styled';
import {
  MessageBoxHorizontalScroll,
  UploadedImage,
  UploadedImageContainer,
} from './components/ChatComponentsStyle';
import { UserAvatar } from '../utils/Avatars/UserAvatar';
import ExtendedBox from '../utils/ExtendedBox';

interface Props {
  message: ChatMessage;
  id?: string;
  menuItems?: { label: string; onClick: () => void }[] | null;
}

const MessageItem: FC<Props> = ({ id, message, children, menuItems }) => {
  const {
    auth: { user: currentUser },
  } = useSelector((state: AppState) => state);
  const { t } = useTranslation();

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
            hoverIndicator={{ background: 'status-disabled' }}
          >
            <MenuItem onClick={item.onClick}>{item.label}</MenuItem>
          </Box>
        ))}
      </Box>
    </ContextMenu>
  );

  const renderAttachments = (attachments?: ChatAttachment[]) => {
    if (!attachments) return null;
    return (
      <MessageBoxHorizontalScroll direction="row" overflow="auto" width="100%">
        {attachments?.map((attachment) => {
          const url = `${process.env.REACT_APP_SERVER_HOST}/v1/chat/attachment/${attachment.name}`;
          return (
            <UploadedImageContainer
              key={attachment.name}
              direction="row"
              justify="between"
              align="center"
              margin="xxsmall"
              pad={{ bottom: 'small' }}
              hoverIndicator={{ background: 'rgba(0,0,0,0.1)' }}
              round="small"
              width="fit-content"
              height={attachments.length === 1 ? 'fit-content' : 'xsmall'}
            >
              <UploadedImage width="100%" height="100%" src={url} />
            </UploadedImageContainer>
          );
        })}
      </MessageBoxHorizontalScroll>
    );
  };

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
            <ExtendedBox
              pad={{
                top: '1px',
                bottom: '1px',
                right: ownMessage ? "'-15.5px'" : '1px',
                left: ownMessage ? "'-15.5px'" : '1px',
              }}
              round="xlarge"
              border={{ color: 'status-disabled-light', size: 'small' }}
            >
              <UserAvatar
                size="medium"
                textProps={{
                  size: 'small',
                }}
                id={message.createdBy.id}
                name={message.createdBy.fullName}
                src={message.createdBy.displayPhoto}
              />
            </ExtendedBox>
            <Box
              direction="column"
              justify="end"
              margin={{ right: 'small' }}
              width="100%"
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
                      ? t('MessageItem.you')
                      : message.createdBy.fullName}
                  </UserFullName>
                  <Text size="small">
                    {dayjs(message.createdOn).format('hh:mm:a')}
                  </Text>
                </Box>
              </Box>
              <Box align={ownMessage ? 'end' : 'start'}>
                <Box width={ownMessage ? '50%' : '100%'}>
                  {message.parent ? (
                    <Text size="xsmall" margin={{ bottom: 'xsmall' }}>
                      <Text size="xsmall" as="i" margin={{ right: 'xsmall' }}>
                        {t('MessageItem.repliedTo')}
                      </Text>
                      <Anchor
                        href={`#message-item-${message.parent.identifier}`}
                      >
                        {message.parent.message}
                      </Anchor>
                    </Text>
                  ) : null}
                </Box>
                <Box width={ownMessage ? '50%' : '100%'}>
                  <Text
                    size="small"
                    margin={{ right: 'xsmall' }}
                    textAlign={ownMessage ? 'end' : 'start'}
                  >
                    {message.deleted
                      ? t('MessageItem.messageDeleted')
                      : message.message}
                  </Text>
                </Box>
                {renderAttachments(message.attachments)}
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
