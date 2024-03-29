import { Box, Image, Text } from 'grommet';
import { nanoid } from 'nanoid';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { socket } from '../../helpers/socket';
import { getChatMessages } from '../../store/services/chat.service';
import { ChatAttachment, ChatMessage } from '../../store/types/chat.types';
import { AppState } from '../../store/reducers/root.reducer';
import MessageItem from './MessageItem';
import { User } from '../../store/types/auth.types';
import ReplyMessage from './layers/ReplyMessage';
import EditMessage from './layers/EditMessage';
import MessageBox from './components/MessageBox';
import {
  MessageBoxContainer,
  DayContainer,
  DayDivider,
  ScrollContainer,
  DayHeader,
} from './ChatStyled';
import PlanMeetingTheme from '../../layers/meeting/custom-theme';
import { errorResponseMessage, getChatRoomName } from '../../helpers/utils';
import { http } from '../../config/http';
import PurpieLogoAnimated from '../../assets/purpie-logo/purpie-logo-animated';
import NoMessage from '../../assets/chat/no-message.svg';

export interface ChatInfo {
  typingUsers: User[];
  unreadMessageCounts: { userId: string; count: number }[];
}

interface Props {
  medium: 'direct' | 'channel' | 'post';
  name?: string;
  id: string;
  canReply?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  handleTypingEvent?: boolean;
  canAddFile?: boolean;
  chatInfo?: ChatInfo;
  setChatInfo?: ({ typingUsers, unreadMessageCounts }: ChatInfo) => void;
}

const FETCH_MESSAGE_LIMIT = 50;

const Chat: React.FC<Props> = ({
  id,
  medium,
  handleTypingEvent,
  name,
  canDelete = true,
  canReply = true,
  canEdit = true,
  canAddFile = false,
  setChatInfo,
  chatInfo,
}) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Array<ChatMessage> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [typingUser, setTypingUser] = useState<User | null>(null);
  const typingTimerId = useRef<NodeJS.Timeout | null>(null);
  const tempMsgIdCounter = useRef(0);
  const containerId = useMemo(nanoid, []);
  const messageBoxScrollRef = useRef<HTMLDivElement>(null);
  const [repliedMessage, setRepliedMessage] = useState<ChatMessage | null>(
    null
  );
  const [editedMessage, setEditedMessage] = useState<ChatMessage | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<Array<File>>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const roomName = getChatRoomName(id, medium);
  const dispatch = useDispatch();
  const [messageErrorDraft, setMessageErrorDraft] = useState<{
    message: Partial<ChatMessage>;
    attachments?: Array<File>;
  } | null>(null);

  const {
    auth: { user: currentUser },
  } = useSelector((state: AppState) => state);

  const updateMessages = (
    handleFunc: (msgs: ChatMessage[] | null) => ChatMessage[] | null
  ) => {
    setMessages(handleFunc);
  };

  const fetchMessages = async () => {
    const result = await getChatMessages(
      medium,
      id,
      FETCH_MESSAGE_LIMIT
      // messages?.length ? messages[0].createdOn : undefined
    ).then((res) => res.data);

    if (!result.length) setHasMore(false);
    updateMessages((msgs) =>
      msgs ? [...result.reverse(), ...msgs] : [...result.reverse()]
    );
  };

  let lastDate: Date | null = null;

  const parseDateToString = (date: Date) => {
    const diff = dayjs().startOf('day').diff(dayjs(date).startOf('day'), 'day');
    if (diff === 0) return t('Chat.today');

    if (diff === 1) return t('Chat.yesterday');

    const equalYears = dayjs(date).get('year') === dayjs().get('year');

    return dayjs(date).format(`dddd, MMMM D${!equalYears ? ', YYYY' : ''}`);
  };

  const handleDeleteMsg = (message: ChatMessage) => {
    socket.emit(
      'delete_message',
      {
        identifier: message.identifier,
        to: id,
        medium: message.medium,
      },
      () => {
        updateMessages(
          (msgs) =>
            msgs &&
            msgs.map((msg) => {
              if (msg.identifier === message.identifier)
                return {
                  ...msg,
                  message: '',
                  deleted: true,
                };

              return msg;
            })
        );
      }
    );
  };

  const handleSendMessage = async (
    incomingMsg: Partial<ChatMessage>,
    attachments?: Array<File>
  ) => {
    const message = { ...incomingMsg };
    const tempId = message.edited
      ? message.identifier
      : ++tempMsgIdCounter.current;

    try {
      setRepliedMessage(null);
      setEditedMessage(null);
      setMessageErrorDraft(null);

      if (!message.edited) {
        updateMessages(
          (msgs) =>
            msgs && [
              ...msgs,
              { ...message, createdBy: currentUser, identifier: tempId } as any,
            ]
        );
        messageBoxScrollRef.current?.scrollTo({
          behavior: 'smooth',
          top: messageBoxScrollRef.current.scrollHeight,
        });
      }

      const attachmentsResponse: Array<ChatAttachment> = !attachments?.length
        ? []
        : await Promise.all(
            attachments.map(async (attachment) => {
              setUploadingFiles((i) => [...i, attachment]);
              const formData = new FormData();
              formData.append('file', attachment);

              return http
                .post('/chat/attachment', formData)
                .then(async (res) => {
                  await setUploadedFiles((i) => [...i, attachment.name]);
                  return res.data;
                })
                .catch(() => setUploadErrors((i) => [...i, attachment.name]));
            })
          );
      message.attachments = attachmentsResponse;

      socket.emit('message', message, (payloadMsg: ChatMessage) => {
        updateMessages(
          (msgs) =>
            msgs &&
            msgs.map((msg) => {
              if (msg.identifier === tempId) return payloadMsg;
              return msg;
            })
        );
      });
    } catch (err: any) {
      setMessageErrorDraft({ message, attachments });
      updateMessages(
        (msgs) => msgs?.filter((msg) => msg.identifier !== tempId) || null
      );
      const toastId = nanoid();
      dispatch({
        type: 'SET_TOAST',
        payload: {
          toastId,
          timeOut: 1000,
          status: 'error',
          message: errorResponseMessage(err?.response?.data || err),
        },
      });
    } finally {
      setUploadingFiles([]);
      setUploadedFiles([]);
    }
  };

  const onTyping = () => {
    socket.emit('typing', { to: id, user: currentUser, medium });
  };

  useEffect(() => {
    const messageListener = (message: ChatMessage): void => {
      if (message.createdBy.id !== id && chatInfo && setChatInfo) {
        const newChatInfo = updateUnreadMessageCount(
          chatInfo,
          message.createdBy.id,
          1
        );
        if (newChatInfo) setChatInfo(newChatInfo);
      }
      if (
        (medium === 'direct' && message.createdBy.id !== id) ||
        (medium !== 'direct' && message.roomName !== roomName)
      )
        return;
      if (message.edited)
        updateMessages(
          (msgs) =>
            msgs &&
            msgs.map((msg) => {
              if (msg.identifier === message.identifier)
                return {
                  ...msg,
                  message: message.message,
                  edited: true,
                };

              return msg;
            })
        );
      else updateMessages((msgs) => [...msgs!, message]);
    };

    const typingListener = (payload: {
      id: number;
      to: number;
      medium: string;
      roomName: string;
      user: Record<string, any>;
    }) => {
      if (
        payload.user.id !== currentUser?.id &&
        (payload.medium === 'direct' ||
          (payload.medium === 'post' && payload.roomName === roomName))
      ) {
        if (typingTimerId.current) {
          clearTimeout(typingTimerId.current);
          typingTimerId.current = null;
        }
        setTypingUser(payload.user as any);
        if (chatInfo && setChatInfo)
          setChatInfo({
            ...chatInfo,
            typingUsers: [...chatInfo.typingUsers, payload.user as User],
          });

        typingTimerId.current = setTimeout(() => {
          if (chatInfo && setChatInfo)
            setChatInfo({
              ...chatInfo,
              typingUsers: chatInfo.typingUsers.filter(
                (u) => u.id !== typingUser?.id
              ),
            });

          setTypingUser(null);
        }, 2000);
      }
    };

    const msgDeletedListener = (payload: {
      identifier: string;
      to: number;
      medium: string;
      roomName: string;
    }) => {
      if (medium !== 'direct' && payload.roomName !== roomName) return;
      updateMessages(
        (msgs) =>
          msgs &&
          msgs.map((msg) => {
            if (msg.identifier === payload.identifier)
              return {
                ...msg,
                message: '',
                deleted: true,
              };

            return msg;
          })
      );
    };

    socket.on('new_message', messageListener);
    socket.on('typing', typingListener);
    socket.on('message_deleted', msgDeletedListener);

    return () => {
      socket.off('new_message', messageListener);
      socket.off('typingListener', typingListener);
      socket.off('message_deleted', msgDeletedListener);
    };
  }, []);

  useEffect(() => {
    if (medium === 'post') {
      socket.emit('join_post', id, fetchMessages);

      return () => {
        setMessages(null);
        socket.emit('leave_post', id);
      };
    }
    if (medium === 'direct') {
      socket.emit('join_direct_user', id, () => fetchMessages());

      return () => {
        setMessages(null);
        socket.emit('leave_direct_user', id);
      };
    }
    fetchMessages();
    return undefined;
  }, [medium, id]);

  if (!messages)
    return (
      <Box justify="center" align="center" height="large">
        <PurpieLogoAnimated width={70} height={70} color="#9060EB" />
      </Box>
    );

  const renderDayItem = (message: ChatMessage) => {
    return (
      <DayContainer width="100%" justify="start" alignSelf="start">
        <DayDivider width="100%" height="3px">
          <Box
            width="100%"
            height="3px"
            background="linear-gradient(315deg, rgba(255, 248, 247, 0.0001) 0%, rgba(255, 240, 237, 0.815838) 52.11%,  100%)"
          />
        </DayDivider>
        <DayHeader
          round="xsmall"
          width="fit-content"
          pad={{ horizontal: 'small', vertical: 'xsmall' }}
          margin={{ vertical: 'xsmall', horizontal: 'medium' }}
          justify="start"
          background="baby-pink"
        >
          <Text textAlign="center" size="small" weight={400} color="dark">
            <i>{parseDateToString(message.createdOn)}</i>
          </Text>
        </DayHeader>
      </DayContainer>
    );
  };

  return (
    <PlanMeetingTheme>
      <Box>
        {editedMessage ? (
          <EditMessage
            message={editedMessage}
            onDismiss={() => setEditedMessage(null)}
            onSubmit={handleSendMessage}
          />
        ) : null}
        {repliedMessage ? (
          <ReplyMessage
            message={repliedMessage}
            name={name}
            to={id}
            user={currentUser!}
            onDismiss={() => setRepliedMessage(null)}
            onSubmit={handleSendMessage}
          />
        ) : null}
        <Box height={`${window.innerHeight}px`}>
          <ScrollContainer
            overflow="auto"
            flex={{ grow: 1 }}
            direction="column-reverse"
            ref={messageBoxScrollRef}
            height="calc(100vh - 500px)"
            id={containerId}
          >
            {messages?.length > 0 ? (
              <InfiniteScroll
                height="100%"
                dataLength={messages.length}
                inverse
                hasMore={hasMore}
                next={fetchMessages}
                loader={
                  <PurpieLogoAnimated width={50} height={50} color="#9060EB" />
                }
                scrollableTarget={containerId}
              >
                {messages?.map((message) => {
                  const isCurrentUserMsg =
                    currentUser?.id === message.createdBy.id;

                  const menuItems = [];
                  if (
                    isCurrentUserMsg &&
                    typeof message.identifier === 'string' &&
                    !message.deleted
                  ) {
                    if (canEdit)
                      menuItems.push({
                        label: t('common.edit'),
                        onClick: () => {
                          setEditedMessage(message);
                        },
                      });
                    if (canDelete)
                      menuItems.push({
                        label: t('common.delete'),
                        onClick: async () => {
                          // eslint-disable-next-line no-alert
                          const proceed = window.confirm(
                            t('Chat.deleteConfirm')
                          );
                          if (proceed) {
                            handleDeleteMsg(message);
                          }
                        },
                      });
                  }
                  if (canReply && !message.deleted)
                    menuItems.push({
                      label: t('common.reply'),
                      onClick: () => {
                        setRepliedMessage(message);
                      },
                    });
                  const item = (
                    <Box
                      key={message.identifier}
                      alignSelf="center"
                      align="center"
                      width="100%"
                    >
                      {!lastDate ||
                      dayjs(message.createdOn)
                        .startOf('day')
                        .diff(dayjs(lastDate).startOf('day'), 'day') > 0
                        ? renderDayItem(message)
                        : null}
                      <MessageItem
                        key={message.id}
                        message={message}
                        id={message.id}
                        menuItems={menuItems}
                      />
                    </Box>
                  );
                  lastDate = message.createdOn;
                  return item;
                })}
              </InfiniteScroll>
            ) : (
              <Box height="100%" align="center" justify="center">
                <Image src={NoMessage} width={339} height={261} />
                <Box
                  justify="center"
                  align="center"
                  margin={{
                    top: '34px',
                    horizontal: '36px',
                  }}
                >
                  <Text size="small" color="status-disabled" textAlign="center">
                    {t('Chat.noMessages')}
                  </Text>
                </Box>
              </Box>
            )}
          </ScrollContainer>
          <MessageBoxContainer pad="small">
            <MessageBox
              name={name}
              handleTypingEvent={handleTypingEvent}
              uploadingFiles={uploadingFiles}
              uploadedFiles={uploadedFiles}
              uploadErrors={uploadErrors}
              onTyping={onTyping}
              user={currentUser!}
              canAddFile={canAddFile}
              messageErrorDraft={messageErrorDraft}
              onSendAgain={() =>
                messageErrorDraft &&
                handleSendMessage(
                  messageErrorDraft?.message,
                  messageErrorDraft?.attachments
                )
              }
              onSubmit={({ message }, attachments) =>
                handleSendMessage(
                  {
                    message,
                    roomName,
                    medium,
                    to: id,
                    createdBy: currentUser as any,
                  },
                  attachments
                )
              }
            />
          </MessageBoxContainer>

          {typingUser && medium !== 'direct' ? (
            <Text size="small" as="i" textAlign="center">
              {t('Chat.typing', { name: typingUser.fullName })}
            </Text>
          ) : null}
        </Box>
      </Box>
    </PlanMeetingTheme>
  );
};

export const updateUnreadMessageCount = (
  chatInfo: ChatInfo,
  userId: string,
  count: number
): ChatInfo | null => {
  const tempUnreadMessageCounts = [...chatInfo.unreadMessageCounts];
  const userUnReadMessageIndex = tempUnreadMessageCounts.findIndex(
    (c) => c.userId === userId
  );
  if (userUnReadMessageIndex !== -1) {
    tempUnreadMessageCounts[userUnReadMessageIndex].count =
      count === 0
        ? 0
        : tempUnreadMessageCounts[userUnReadMessageIndex].count + count;
    return {
      ...chatInfo,
      unreadMessageCounts: tempUnreadMessageCounts,
    };
  }
  return null;
};
export default Chat;
