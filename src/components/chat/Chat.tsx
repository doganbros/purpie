import { Box, Header, Menu, Text, TextArea } from 'grommet';
import { nanoid } from 'nanoid';
import { useSelector } from 'react-redux';
import { MoreVertical } from 'grommet-icons';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { socket } from '../../helpers/socket';
import PlanMeetingTheme from '../../layers/meeting/custom-theme';
import { getChatMessages } from '../../store/services/chat.service';
import { ChatMessage } from '../../store/types/chat.types';
import { AppState } from '../../store/reducers/root.reducer';
import MessageItem from './MessageItem';
import { useThrottle } from '../../hooks/useThrottle';
import { User } from '../../store/types/auth.types';

interface Props {
  medium: 'direct' | 'channel' | 'post';
  name?: string;
  id: number;
  canReply?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  handleTypingEvent?: boolean;
  height?: string;
}

const TYPING_THROTTLE_INTERVAL = 700;
const FETCH_MESSAGE_LIMIT = 50;

const Chat: React.FC<Props> = ({
  id,
  medium,
  handleTypingEvent,
  name,
  canDelete = true,
  canReply = true,
  canEdit = true,
  height = '90vh',
}) => {
  const [messages, setMessages] = useState<Array<ChatMessage> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [typingUser, setTypingUser] = useState<User | null>(null);
  const typingTimerId = useRef<NodeJS.Timeout | null>(null);
  const tempMsgIdCounter = useRef(0);
  const containerId = useMemo(() => nanoid(), []);

  const throttle = useThrottle();

  const {
    auth: { user: currentUser },
  } = useSelector((state: AppState) => state);

  const fetchMessages = async () => {
    const result = await getChatMessages(
      medium,
      id,
      FETCH_MESSAGE_LIMIT,
      messages?.length ? messages[0].createdOn : undefined
    ).then((res) => res.data);

    if (!result.length) setHasMore(false);

    setMessages((msgs) =>
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
        setMessages(
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
    const tempId = ++tempMsgIdCounter.current;
    setMessages(
      (msgs) =>
        msgs && [
          ...msgs,
          { ...message, createdBy: currentUser, identifier: tempId } as any,
        ]
    );

    socket.emit('message', message, (payloadMsg: ChatMessage) => {
      setMessages(
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
        setMessages(
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
      else setMessages((msgs) => [...msgs!, message]);
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

      setMessages(
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

  return (
    <PlanMeetingTheme>
      <Box>
        <Box
          height={height}
          overflow="auto"
          flex={{ grow: 1 }}
          direction="column-reverse"
          id={containerId}
        >
          <InfiniteScroll
            dataLength={messages.length}
            inverse
            hasMore={hasMore}
            next={fetchMessages}
            loader={<h4>Loading...</h4>}
            scrollableTarget={containerId}
          >
            {messages.map((message) => {
              const isCurrentUserMsg = currentUser?.id === message.createdBy.id;

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
                      // setEditedPost(message);
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
                    // setRepliedPost(message);
                  },
                });

              const item = (
                <Fragment key={message.identifier}>
                  {!lastDate ||
                  dayjs(message.createdOn)
                    .startOf('day')
                    .diff(dayjs(lastDate).startOf('day'), 'day') > 0 ? (
                    <Header
                      background="accent-3"
                      round="small"
                      pad="xsmall"
                      margin={{ vertical: 'xsmall' }}
                      justify="center"
                    >
                      <Text textAlign="center" size="small">
                        {parseDateToString(message.createdOn)}
                      </Text>
                    </Header>
                  ) : null}
                  <MessageItem
                    key={message.id}
                    message={message}
                    actions={
                      menuItems.length ? (
                        <Menu
                          size="small"
                          dropProps={{
                            align: { top: 'bottom', left: 'left' },
                            elevation: 'indigo',
                          }}
                          icon={<MoreVertical size="20px" />}
                          items={menuItems}
                        />
                      ) : null
                    }
                  />
                </Fragment>
              );
              lastDate = message.createdOn;
              return item;
            })}
          </InfiniteScroll>
        </Box>
        <TextArea
          placeholder={`Write ${name ? `to ${name}` : 'your message...'} `}
          resize="vertical"
          fill
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              e.shiftKey === false &&
              e.currentTarget.value
            ) {
              e.preventDefault();
              handleSendMessage({
                message: e.currentTarget.value,
                medium,
                to: id,
                createdBy: currentUser as any,
              });
              e.currentTarget.value = '';
              return null;
            }
            if (handleTypingEvent)
              return throttle(() => {
                onTyping();
              }, TYPING_THROTTLE_INTERVAL);
            return null;
          }}
        />
        {typingUser ? (
          <Text size="small" as="i">
            {typingUser.firstName} {typingUser.lastName} is typing...
          </Text>
        ) : null}
      </Box>
    </PlanMeetingTheme>
  );
};

export default Chat;
