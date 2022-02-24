import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from 'mattermost-redux/types/posts';
import { nanoid } from 'nanoid';
import { Client4 } from 'mattermost-redux/client';
import { Box, Header, Menu, Text, TextArea } from 'grommet';
import InfiniteScroll from 'react-infinite-scroll-component';
import { HeightType } from 'grommet/utils';
import { MoreVertical } from 'grommet-icons';
import dayjs from 'dayjs';
import webSocketClient from 'mattermost-redux/client/websocket_client';
import { AppState } from '../../store/reducers/root.reducer';
import PostItem from './PostItem';
import EditPost from './layers/EditPost';
import ReplyPost from './layers/ReplyPost';
import PlanMeetingTheme from '../../layers/meeting/custom-theme';
import { setToastAction } from '../../store/actions/util.action';
import {
  setChannelByNameAction,
  setUserProfilesFromPostAction,
  setUserProfilesIfNotExistsAction,
} from '../../store/actions/mattermost.action';
import { useThrottle } from '../../hooks/useThrottle';

interface Props {
  channelName: string;
  canDelete?: boolean;
  handleTypingEvent?: boolean;
  canEdit?: boolean;
  canReply?: boolean;
  renderMessage?: (post: Post) => React.ReactNode;
  height?: HeightType;
}

const Chat: FC<Props> = ({
  canDelete = true,
  handleTypingEvent = true,
  canEdit = true,
  channelName,
  canReply = true,
  height = '90vh',
  renderMessage,
}) => {
  const PER_PAGE = 60;
  const USER_TYPING_SEND_EVENT_INTERVAL = 8000;
  const TYPING_THROTTLE_INTERVAL = 2000;
  const [channelId, setChannelId] = useState('');

  const throttle = useThrottle();
  const [hasMore, setHasMore] = useState(true);
  const containerId = useRef(nanoid());
  const [page, setPage] = useState(0);
  const [editedPost, setEditedPost] = useState<Post | null>(null);
  const [repliedPost, setRepliedPost] = useState<Post | null>(null);
  const [userTyping, setUserTyping] = useState<{
    id: string;
    seq: number;
  } | null>(null);
  const [currentPosts, setCurrentPosts] = useState<{
    order: Array<string>;
    posts: Record<string, Post>;
  }>({ order: [], posts: {} });
  const dispatch = useDispatch();

  const {
    mattermost: {
      channels,
      currentUser: currentMattermostUser,
      userProfiles,
      websocketEvent,
    },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    setChannelId('');
    dispatch(setChannelByNameAction(channelName));
  }, [channelName]);

  useEffect(() => {
    if (!channelId) {
      const channel = Object.values(channels).find(
        (c) => c.channel.name === channelName
      );

      if (channel) {
        setChannelId(channel.channel.id);
      }
    }
  }, [channels]);

  useEffect(() => {
    if (
      websocketEvent?.event === 'posted' &&
      websocketEvent?.broadcast.channel_id === channelId
    ) {
      const post = JSON.parse(websocketEvent.data.post) as Post;

      dispatch(setUserProfilesFromPostAction({ [post.id]: post }));
      setUserTyping(null);

      if (!currentPosts.posts[post.id]) {
        setCurrentPosts((v) => ({
          ...v,
          order: [...v.order, post.id],
          posts: { ...v.posts, [post.id]: post },
        }));
      }
    } else if (
      websocketEvent?.event === 'post_edited' &&
      websocketEvent?.broadcast.channel_id === channelId
    ) {
      const post = JSON.parse(websocketEvent.data.post) as Post;

      setCurrentPosts((v) => ({
        ...v,
        posts: { ...v.posts, [post.id]: post },
      }));
    } else if (
      websocketEvent?.event === 'post_deleted' &&
      websocketEvent?.broadcast.channel_id === channelId
    ) {
      const post = JSON.parse(websocketEvent.data.post) as Post;
      setCurrentPosts((v) => ({
        ...v,
        posts: {
          ...v.posts,
          [post.id]: { ...post, message: '(message deleted)' },
        },
      }));
    } else if (
      handleTypingEvent &&
      websocketEvent?.event === 'typing' &&
      websocketEvent?.broadcast.channel_id === channelId &&
      websocketEvent?.data.user_id !== currentMattermostUser?.id
    ) {
      setUserTyping({
        id: websocketEvent.data.user_id,
        seq: websocketEvent.seq,
      });
      dispatch(setUserProfilesIfNotExistsAction([websocketEvent.data.user_id]));

      setTimeout(
        (seq: number) => {
          if (seq === websocketEvent.seq) setUserTyping(null);
        },
        USER_TYPING_SEND_EVENT_INTERVAL,
        websocketEvent.seq
      );
    }
  }, [websocketEvent]);

  const selectedChannel = channels[channelId];

  const fetchMore = async (reset?: boolean) => {
    const postLength = reset ? 0 : currentPosts.order.length;
    if (postLength >= selectedChannel.channel.total_msg_count) {
      return setHasMore(false);
    }
    const result = !postLength
      ? await Client4.getPosts(channelId, 0, PER_PAGE + 1)
      : await Client4.getPostsBefore(
          channelId,
          currentPosts.order[currentPosts.order.length - 1],
          page,
          PER_PAGE
        );

    if (!result.order.length) return setHasMore(false);
    const p = result.posts as any;

    dispatch(setUserProfilesFromPostAction(p));

    setCurrentPosts((v) => ({
      ...v,
      order: reset
        ? result.order.reverse()
        : [...result.order.reverse(), ...v.order],
      posts: reset ? p : { ...v.posts, ...p },
    }));

    return setPage((v) => (reset ? 1 : v + 1));
  };

  useEffect(() => {
    if (selectedChannel) {
      fetchMore(true);
    }
  }, [selectedChannel]);

  let lastDate: number | null = null;

  const parseDateToString = (date: number) => {
    const diff = dayjs().startOf('day').diff(dayjs(date).startOf('day'), 'day');
    if (diff === 0) return 'Today';

    if (diff === 1) return 'Yesterday';

    const equalYears = dayjs(date).get('year') === dayjs().get('year');

    return dayjs(date).format(`dddd, MMMM D${!equalYears ? ', YYYY' : ''}`);
  };

  if (!selectedChannel) return null;

  return (
    <PlanMeetingTheme>
      {editedPost ? (
        <EditPost
          id={editedPost.id}
          message={editedPost.message}
          onDismiss={() => setEditedPost(null)}
        />
      ) : null}
      {repliedPost ? (
        <ReplyPost
          post={repliedPost}
          name={userProfiles?.[repliedPost.user_id]?.username ?? '...'}
          onDismiss={() => setRepliedPost(null)}
        />
      ) : null}

      <Box>
        <Box
          id={containerId.current}
          height={height}
          overflow="auto"
          flex={{ grow: 1 }}
          direction="column-reverse"
        >
          <InfiniteScroll
            dataLength={currentPosts.order.length}
            inverse
            hasMore={hasMore}
            next={fetchMore}
            loader={<h4>Loading...</h4>}
            scrollableTarget={containerId.current}
          >
            {currentPosts.order.map((postId) => {
              const post = currentPosts.posts[postId];
              if (post.type === 'system_join_channel') return null;

              const isCurrentUserPost =
                currentMattermostUser?.id === post.user_id;

              const menuItems = [];
              if (isCurrentUserPost) {
                if (canEdit)
                  menuItems.push({
                    label: 'Edit',
                    onClick: () => {
                      setEditedPost(post);
                    },
                  });
                if (canDelete)
                  menuItems.push({
                    label: 'Delete',
                    onClick: async () => {
                      // eslint-disable-next-line no-alert
                      const proceed = window.confirm(
                        'Are you sure you want to delete this post?'
                      );
                      if (proceed) {
                        await Client4.deletePost(post.id);
                        setToastAction('ok', 'Successfuly delete post!');
                      }
                    },
                  });
              }
              if (canReply)
                menuItems.push({
                  label: 'Reply',
                  onClick: () => {
                    setRepliedPost(post);
                  },
                });

              const item = (
                <Fragment key={post.id}>
                  {!lastDate ||
                  dayjs(post.create_at)
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
                        {parseDateToString(post.create_at)}
                      </Text>
                    </Header>
                  ) : null}
                  <PostItem
                    id={post.id}
                    key={post.id}
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
                    message={
                      renderMessage ? (
                        renderMessage(post)
                      ) : (
                        <Text size="small">{post.message}</Text>
                      )
                    }
                    rootPost={currentPosts.posts[post.root_id]}
                    editedDate={post.edit_at}
                    date={post.create_at}
                    name={userProfiles?.[post.user_id]?.username ?? '...'}
                    side="left"
                  />
                </Fragment>
              );
              lastDate = post.create_at;
              return item;
            })}
          </InfiniteScroll>
        </Box>
        <TextArea
          placeholder={`Write to ${selectedChannel.channel.display_name}`}
          resize="vertical"
          fill
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              e.shiftKey === false &&
              e.currentTarget.value
            ) {
              e.preventDefault();
              Client4.createPost({
                message: e.currentTarget.value,
                channel_id: channelId,
              } as any);
              e.currentTarget.value = '';
              return null;
            }
            if (handleTypingEvent)
              return throttle(() => {
                webSocketClient.userTyping(channelId, '');
              }, TYPING_THROTTLE_INTERVAL);
            return null;
          }}
        />
        {userTyping ? (
          <Text size="small" as="i">
            {userProfiles[userTyping.id]?.username || 'Someone'} is typing...
          </Text>
        ) : null}
      </Box>
    </PlanMeetingTheme>
  );
};

export default Chat;
