/* eslint-disable no-console */
import { useParams } from 'react-router-dom';
import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from 'mattermost-redux/types/posts';
import { nanoid } from 'nanoid';
import { Client4 } from 'mattermost-redux/client';
import { Box, Header, Menu, Text, TextArea } from 'grommet';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MoreVertical } from 'grommet-icons';
import dayjs from 'dayjs';
import webSocketClient from 'mattermost-redux/client/websocket_client';
import PrivatePageLayout from '../../layouts/PrivatePageLayout/PrivatePageLayout';
import { AppState } from '../../../store/reducers/root.reducer';
import MattermostChannelList from './MattermostChannelList';
import PostItem from './PostItem';
import EditPost from './layers/EditPost';
import ReplyPost from './layers/ReplyPost';
import PlanMeetingTheme from '../../../layers/meeting/custom-theme';
import { setToastAction } from '../../../store/actions/util.action';
import { setUserProfilesFromPostAction } from '../../../store/actions/mattermost.action';
import { useThrottle } from '../../../hooks/useThrottle';

interface Params {
  channelId: string;
}

const Chat: FC = () => {
  const { channelId } = useParams<Params>();
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
    if (
      websocketEvent?.event === 'posted' &&
      websocketEvent?.broadcast.channel_id === channelId
    ) {
      const post = JSON.parse(websocketEvent.data.post) as Post;

      dispatch(setUserProfilesFromPostAction({ [post.id]: post }));

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
      websocketEvent?.event === 'typing' &&
      websocketEvent?.broadcast.channel_id === channelId &&
      websocketEvent?.data.user_id !== currentMattermostUser?.id
    ) {
      setUserTyping({
        id: websocketEvent.data.user_id,
        seq: websocketEvent.seq,
      });

      setTimeout(
        (seq: number) => {
          if (seq === websocketEvent.seq) setUserTyping(null);
        },
        10000,
        websocketEvent.seq
      );
    }
  }, [websocketEvent]);

  const selectedChannel = channels[channelId];

  const fetchMore = async () => {
    const postLength = Object.keys(currentPosts.posts).length;
    if (postLength >= (selectedChannel.channel as any).total_msg_count) {
      return setHasMore(false);
    }
    const result = !postLength
      ? await Client4.getPosts(channelId, page, 61)
      : await Client4.getPostsBefore(
          channelId,
          currentPosts.order[currentPosts.order.length - 1],
          page,
          60
        );

    if (!result.order.length) return setHasMore(false);

    dispatch(setUserProfilesFromPostAction(result.posts as any));

    setCurrentPosts((v) => ({
      ...v,
      order: [...v.order, ...result.order.reverse()],
      posts: { ...v.posts, ...(result.posts as any) },
    }));

    return setPage((v) => v + 1);
  };

  useEffect(() => {
    if (selectedChannel) {
      fetchMore();
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

  return (
    <PrivatePageLayout title="Chat" rightComponent={<MattermostChannelList />}>
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
            name={
              selectedChannel.metaData?.users?.[repliedPost.user_id]
                ?.username || ''
            }
            onDismiss={() => setRepliedPost(null)}
          />
        ) : null}
        {selectedChannel ? (
          <>
            <Box
              id={containerId.current}
              height="90vh"
              overflow="auto"
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

                  const isCurrentUserPost =
                    currentMattermostUser?.id === post.user_id;

                  const menuItems = [];
                  if (isCurrentUserPost) {
                    menuItems.push({
                      label: 'Edit',
                      onClick: () => {
                        setEditedPost(post);
                      },
                    });
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
                          <Menu
                            size="small"
                            dropProps={{
                              align: { top: 'bottom', left: 'left' },
                              elevation: 'xlarge',
                            }}
                            icon={<MoreVertical size="20px" />}
                            items={menuItems}
                          />
                        }
                        message={post.message}
                        rootPost={currentPosts.posts[post.root_id]}
                        editedDate={post.edit_at}
                        date={post.create_at}
                        name={userProfiles?.[post.user_id]?.username ?? '...'}
                        side={isCurrentUserPost ? 'right' : 'left'}
                      />
                    </Fragment>
                  );
                  lastDate = post.create_at;
                  return item;
                })}
              </InfiniteScroll>
            </Box>
            <TextArea
              placeholder={`Write to ${selectedChannel.metaData?.displayName}`}
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
                return throttle(() => {
                  console.log('entered func');
                  webSocketClient.userTyping(channelId, '');
                }, 2000);
              }}
            />
            {userTyping ? (
              <span>
                {userProfiles[userTyping.id]?.username || 'Someone'} is
                typing...
              </span>
            ) : null}
          </>
        ) : null}
      </PlanMeetingTheme>
    </PrivatePageLayout>
  );
};

export default Chat;
