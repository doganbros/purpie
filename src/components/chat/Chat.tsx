import { Box, Header, Text } from 'grommet';
import { nanoid } from 'nanoid';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { socket } from '../../helpers/socket';
import { getChatMessages } from '../../store/services/chat.service';
import { ChatMessage } from '../../store/types/chat.types';
import { AppState } from '../../store/reducers/root.reducer';
import MessageItem from './MessageItem';
import { User } from '../../store/types/auth.types';
import ReplyMessage from './layers/ReplyMessage';
import EditMessage from './layers/EditMessage';
import MessageBox from './components/MessageBox';
import { MessageBoxContainer } from './ChatStyled';
import PlanMeetingTheme from '../../layers/meeting/custom-theme';

interface Props {
  medium: 'direct' | 'channel' | 'post';
  name?: string;
  id: number;
  canReply?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  handleTypingEvent?: boolean;
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
}) => {
  const [messages, setMessages] = useState<Array<ChatMessage> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [typingUser, setTypingUser] = useState<User | null>(null);
  const typingTimerId = useRef<NodeJS.Timeout | null>(null);
  const tempMsgIdCounter = useRef(0);
  const messageScrollRef = useRef<HTMLDivElement>(null);
  const containerId = useMemo(nanoid, []);
  const [repliedMessage, setRepliedMessage] = useState<ChatMessage | null>(
    null
  );
  const [editedMessage, setEditedMessage] = useState<ChatMessage | null>(null);

  const {
    auth: { user: currentUser },
  } = useSelector((state: AppState) => state);
  const scrollTarget = messageScrollRef.current;

  const checkScrollShouldEnd = () =>
    scrollTarget &&
    messages &&
    messages?.length > 0 &&
    scrollTarget.offsetTop > scrollTarget.scrollHeight &&
    scrollTarget.offsetHeight + scrollTarget.scrollTop >
      scrollTarget.scrollHeight - 100;

  useEffect(() => {
    if (messageScrollRef.current) {
      messageScrollRef.current.scrollTop =
        messageScrollRef.current.scrollHeight;
    }
  }, [messageScrollRef.current, messages]);

  const updateMessages = (
    handleFunc: (msgs: ChatMessage[] | null) => ChatMessage[] | null
  ) => {
    const scrollShouldEnd = checkScrollShouldEnd();
    setMessages(handleFunc);
    if (scrollShouldEnd) {
      scrollTarget?.scrollTo({ top: scrollTarget.scrollHeight });
    }
  };

  const fetchMessages = async () => {
    const result = await getChatMessages(
      medium,
      id,
      FETCH_MESSAGE_LIMIT,
      messages?.length ? messages[0].createdOn : undefined
    ).then((res) => res.data);

    if (!result.length) setHasMore(false);
    updateMessages((msgs) =>
      msgs ? [...result.reverse(), ...msgs] : [...result.reverse()]
    );
  };

  let lastDate: Date | null = null;

  const parseDateToString = (date: Date) => {
    const diff = dayjs().startOf('day').diff(dayjs(date).startOf('day'), 'day');
    if (diff === 0) return 'Today';

    if (diff === 1) return 'Yesterday';

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

  const handleSendMessage = (message: Partial<ChatMessage>) => {
    setRepliedMessage(null);
    setEditedMessage(null);
    const tempId = message.edited
      ? message.identifier
      : ++tempMsgIdCounter.current;

    if (!message.edited) {
      updateMessages(
        (msgs) =>
          msgs && [
            ...msgs,
            { ...message, createdBy: currentUser, identifier: tempId } as any,
          ]
      );
    }

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
  };

  const onTyping = () => {
    socket.emit('typing', { to: id, user: currentUser });
  };

  useEffect(() => {
    const messageListener = (message: ChatMessage): void => {
      if (!(message.to === id && message.medium === medium)) return;
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
      user: Record<string, any>;
    }) => {
      if (payload.user.id !== currentUser?.id && payload.to === id) {
        if (typingTimerId.current) {
          clearTimeout(typingTimerId.current);
          typingTimerId.current = null;
        }
        setTypingUser(payload.user as any);
        typingTimerId.current = setTimeout(() => {
          setTypingUser(null);
        }, 2000);
      }
    };

    const msgDeletedListener = (payload: {
      identifier: string;
      to: number;
      medium: string;
    }) => {
      if (!(payload.to === id && payload.medium === medium)) return;
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
    return undefined;
  }, [medium, id]);

  if (!messages) return <Box>Loading...</Box>;

  const renderDayItem = (message: ChatMessage) => {
    return (
      <Header
        round="small"
        pad={{ horizontal: 'small', vertical: 'xsmall' }}
        margin={{ vertical: 'xsmall' }}
        justify="center"
        border={{ color: 'rgba(0,0,0,0.1)', size: 'xsmall' }}
      >
        <Text textAlign="center" size="small">
          {parseDateToString(message.createdOn)}
        </Text>
      </Header>
    );
  };

  return (
    <PlanMeetingTheme>
      <Box height="100vh">
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
        <Box fill>
          <Box id={containerId} flex overflow="auto" ref={messageScrollRef}>
            <InfiniteScroll
              height="100%"
              dataLength={messages.length}
              inverse
              hasMore={hasMore}
              next={fetchMessages}
              loader={<h4>Loading...</h4>}
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
                      label: 'Edit',
                      onClick: () => {
                        setEditedMessage(message);
                      },
                    });
                  if (canDelete)
                    menuItems.push({
                      label: 'Delete',
                      onClick: async () => {
                        // eslint-disable-next-line no-alert
                        const proceed = window.confirm(
                          'Are you sure you want to delete this message?'
                        );
                        if (proceed) {
                          handleDeleteMsg(message);
                        }
                      },
                    });
                }
                if (canReply && !message.deleted)
                  menuItems.push({
                    label: 'Reply',
                    onClick: () => {
                      setRepliedMessage(message);
                    },
                  });
                const item = (
                  <Box
                    key={message.identifier}
                    alignSelf="center"
                    align="center"
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
          </Box>
          <MessageBoxContainer flex={false} pad="small">
            <MessageBox
              name={name}
              handleTypingEvent={handleTypingEvent}
              onTyping={onTyping}
              user={currentUser!}
              onSubmit={({ message }) =>
                handleSendMessage({
                  message,
                  medium,
                  to: id,
                  createdBy: currentUser as any,
                })
              }
            />
          </MessageBoxContainer>

          {typingUser ? (
            <Text size="small" as="i">
              {typingUser.firstName} {typingUser.lastName} is typing...
            </Text>
          ) : null}
        </Box>
      </Box>
    </PlanMeetingTheme>
  );
};

export default Chat;
