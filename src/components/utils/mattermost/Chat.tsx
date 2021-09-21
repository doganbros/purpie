/* eslint-disable no-console */
import { useParams } from 'react-router-dom';
import React, { FC, Fragment, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Post } from 'mattermost-redux/types/posts';
import { nanoid } from 'nanoid';
import { Client4 } from 'mattermost-redux/client';
import { Box, Text, TextArea } from 'grommet';
import InfiniteScroll from 'react-infinite-scroll-component';

import dayjs from 'dayjs';
import PrivatePageLayout from '../../layouts/PrivatePageLayout/PrivatePageLayout';
import { AppState } from '../../../store/reducers/root.reducer';
import MessageItem from '../MessageItem';
import MattermostChannelList from './MattermostChannelList';

interface Params {
  channelId: string;
}

const Chat: FC = () => {
  const { channelId } = useParams<Params>();
  const [hasMore, setHasMore] = useState(true);
  const [posts, setPosts] = useState<Array<Post>>([]);
  const containerId = useRef(nanoid());
  const [page, setPage] = useState(0);

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
    }
  }, [websocketEvent]);

  const selectedChannel = channels[channelId];

  const fetchMore = async () => {
    if (posts.length >= (selectedChannel.channel as any).total_msg_count_root) {
      return setHasMore(false);
    }
    const result = !posts.length
      ? await Client4.getPosts(channelId, page, 60, false, true)
      : await Client4.getPostsBefore(
          channelId,
          posts[posts.length - 1].id,
          page,
          60,
          false,
          true
        );

    if (!result.order.length) return setHasMore(false);

    const populatedPosts: any = [];

    result.order.reverse().forEach((postId) => {
      populatedPosts.push((result.posts as any)[postId]);
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
      {selectedChannel ? (
        <>
          <Box
            id={containerId.current}
            style={{
              height: '90vh',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column-reverse',
            }}
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
                const item = (
                  <Fragment key={post.id}>
                    {!lastDate ||
                    dayjs(post.create_at)
                      .startOf('day')
                      .diff(dayjs(lastDate).startOf('day'), 'day') > 0 ? (
                      <>
                        <Box justify="center">
                          <Text textAlign="center" size="small">
                            {parseDateToString(post.create_at)}
                          </Text>
                        </Box>
                        <hr />
                      </>
                    ) : null}
                    <MessageItem
                      key={post.id}
                      avatarSrc=""
                      message={post.message}
                      name={`${
                        selectedChannel.metaData?.users?.[post.user_id]
                          ?.username || ''
                      } ${dayjs(post.create_at).format('hh:mm:a')}`}
                      side={
                        currentMattermostUser?.id === post.user_id
                          ? 'right'
                          : 'left'
                      }
                    >
                      {post.reply_count ? (
                        <Box gap="small">
                          <Text size="small"> {post.reply_count} replies </Text>
                        </Box>
                      ) : null}
                    </MessageItem>
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
              if (e.key === 'Enter' && e.shiftKey === false) {
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
    </PrivatePageLayout>
  );
};

export default Chat;
