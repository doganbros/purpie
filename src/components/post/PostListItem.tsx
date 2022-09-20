import React, { FC, useState } from 'react';
import { Box, Stack, Text } from 'grommet';
import { Chat, Favorite } from 'grommet-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { VideoPost } from './VideoPost';
import { ImagePost } from './ImagePost';
import { Post } from '../../store/types/post.types';
import { FavoriteFill } from '../utils/CustomIcons';

dayjs.extend(relativeTime);

interface PostListItemProps {
  post: Post;
  onClickPlay: (id: number) => any;
  onClickSave: (id: number) => any;
}

const PostListItem: FC<PostListItemProps> = ({
  post,
  onClickPlay,
  onClickSave,
}) => {
  const [hover, setHover] = useState(false);
  const isVideoPost = post.videoName || post.streaming;
  return (
    <Stack
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      fill
      interactiveChild="first"
    >
      <Box
        fill
        gap="medium"
        direction="row"
        onClick={() => {
          if (isVideoPost) onClickPlay(post.id);
        }}
        focusIndicator={false}
      >
        <Box width="320px">
          <Box round={{ size: 'medium' }} overflow="hidden" gap="small">
            {isVideoPost ? (
              <VideoPost
                id={post.id}
                live={post.streaming}
                onClickSave={onClickSave}
                saved={post.saved}
                slug={post.slug}
                videoName={post.videoName}
              />
            ) : (
              <ImagePost id={post.id} />
            )}
          </Box>
        </Box>
        <Box flex={{ grow: 1 }} gap="small">
          <Text size="large" weight="bold" color="brand">
            {post.title}
          </Text>
          <Text color="status-disabled" weight="bold">
            {dayjs(post.createdOn).format('DD.MM.YYYY')}
          </Text>
          <Text color="status-disabled">
            {post.createdBy?.firstName} {post.createdBy?.lastName}
          </Text>

          <Text color="status-disabled">{post.description}</Text>

          <Box direction="row" justify="between" align="start">
            <Box
              direction="row"
              align="center"
              gap="small"
              flex={{ shrink: 0 }}
            >
              {post.liked ? (
                <FavoriteFill color="brand" />
              ) : (
                <Favorite color="status-disabled" />
              )}
              <Text size="small" color="status-disabled">
                {post.postReaction.likesCount}
              </Text>
              <Chat color="status-disabled" />
              <Text color="status-disabled">
                {post.postReaction.commentsCount}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
      {hover && (
        <Box
          round="medium"
          fill
          background={{ color: 'brand', opacity: 'weak' }}
        />
      )}
    </Stack>
  );
};
export default PostListItem;
