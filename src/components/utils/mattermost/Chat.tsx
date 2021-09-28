/* eslint-disable no-console */
import { useParams } from 'react-router-dom';
import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Post } from 'mattermost-redux/types/posts';
import { nanoid } from 'nanoid';
import { Client4 } from 'mattermost-redux/client';
import { Box, Header, Menu, Text, TextArea } from 'grommet';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MoreVertical } from 'grommet-icons';
import dayjs from 'dayjs';
import PrivatePageLayout from '../../layouts/PrivatePageLayout/PrivatePageLayout';
import { AppState } from '../../../store/reducers/root.reducer';
import MattermostChannelList from './MattermostChannelList';
import PostItem from './PostItem';
import EditPost from './layers/EditPost';
import ReplyPost from './layers/ReplyPost';
import PlanMeetingTheme from '../../../layers/meeting/custom-theme';
import { setToastAction } from '../../../store/actions/util.action';

interface Params {
  channelId: string;
}

const Chat: FC = () => {
  const { channelId } = useParams<Params>();
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<Array<Post>>([]);
  const containerId = useRef(nanoid());
  const [page, setPage] = useState(0);
  const rootPosts = useRef<Record<string, Post>>({});
  const [editedPost, setEditedPost] = useState<Post | null>(null);
  const [repliedPost, setRepliedPost] = useState<Post | null>(null);

  const {
    mattermost: {
      channels,
      currentUser: currentMattermostUser,
      websocketEvent,
    },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    if (
      websocketEvent?.event === 'posted' &&
      websocketEvent?.broadcast.channel_id === channelId
    ) {
      const post = JSON.parse(websocketEvent.data.post);
      if (!posts.length || posts[posts.length - 1].id !== post.id)
        setPosts((p) => [...p, post]);
    } else if (
      websocketEvent?.event === 'post_edited' &&
      websocketEvent?.broadcast.channel_id === channelId
    ) {
      const post = JSON.parse(websocketEvent.data.post) as Post;

      if (rootPosts.current[post.id]) rootPosts.current[post.id] = post;
      if (posts.length)
        setPosts((p) =>
          p.map((cp) => {
            if (cp.id === post.id) return post;
            return cp;
          })
        );
    } else if (
      websocketEvent?.event === 'post_deleted' &&
      websocketEvent?.broadcast.channel_id === channelId
    ) {
      const post = JSON.parse(websocketEvent.data.post) as Post;
      setPosts((p) =>
        p.map((cp) => {
          if (cp.id === post.id) {
            post.message = '(message deleted)';
            return post;
          }
          return cp;
        })
      );
    }
  }, [websocketEvent]);

  const selectedChannel = channels[channelId];

  const fetchMore = async () => {
    if (posts.length >= (selectedChannel.channel as any).total_msg_count) {
      return setHasMore(false);
    }
    const result = !posts.length
      ? await Client4.getPosts(channelId, page, 61)
      : await Client4.getPostsBefore(
          channelId,
          posts[posts.length - 1].id,
          page,
          60
        );

    if (!result.order.length) return setHasMore(false);

    const populatedPosts: any = [];

    result.order.reverse().forEach((postId) => {
      const currentPost = (result.posts as any)[postId];

      if (currentPost.root_id) {
        if (!rootPosts.current[currentPost.root_id])
          rootPosts.current[currentPost.root_id] = (result.posts as any)[
            currentPost.root_id
          ];
      }

      populatedPosts.push(currentPost);
    });

    setPosts((v) => [...populatedPosts, ...v]);
    return setPage((v) => v + 1);
  };

  useEffect(() => {
    if (selectedChannel) {
      fetchMore();
    }
  }, [selectedChannel]);

  let lastDate: number | null = null;

  const parseDateToString = (date: number) => {
    const diff = dayjs().diff(date, 'day');
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
                dataLength={posts.length}
                inverse
                hasMore={hasMore}
                next={fetchMore}
                loader={<h4>Loading...</h4>}
                scrollableTarget={containerId.current}
              >
                {posts.map((post) => {
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
                        rootPost={rootPosts.current[post.root_id]}
                        editedDate={post.edit_at}
                        date={post.create_at}
                        name={
                          selectedChannel.metaData?.users?.[post.user_id]
                            ?.username || ''
                        }
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
                }
              }}
            />
          </>
        ) : null}
      </PlanMeetingTheme>
    </PrivatePageLayout>
  );
};

export default Chat;
