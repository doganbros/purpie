import React, { FC, useState } from 'react';
import { Box, Stack, Text } from 'grommet';
import { Chat, Favorite } from 'grommet-icons';
import ExtendedBox from '../utils/ExtendedBox';
import { VideoPost } from './VideoPost';
import { ImagePost } from './ImagePost';
import { Post } from '../../store/types/post.types';
import { FavoriteFill } from '../utils/CustomIcons';
import { getTimezoneTimeFromUTC } from '../../helpers/utils';
import { UserAvatar } from '../utils/Avatars/UserAvatar';

interface PostGridItemProps {
  post: Post;
  onClickPlay: (id: number) => any;
  onClickSave: (id: number) => any;
}

const PostGridItem: FC<PostGridItemProps> = ({
  post,
  onClickPlay,
  onClickSave,
}) => {
  const [hover, setHover] = useState(false);
  return (
    <Stack
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      fill
      interactiveChild="first"
    >
      <Box fill pad="small">
        <Box
          fill
          onClick={() => {
            onClickPlay(post.id);
          }}
          focusIndicator={false}
          round={{ size: 'medium' }}
          overflow="hidden"
          gap="small"
          pad={{ bottom: 'small' }}
        >
          {post.videoName || post.streaming ? (
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

          <ExtendedBox
            position="relative"
            direction="row"
            align="center"
            justify="between"
          >
            <Box direction="row" align="center">
              <Box
                margin={{ top: '-35px', left: '-3px' }}
                background="brand"
                round="large"
                border={{ size: 'large', color: 'white' }}
              >
                <UserAvatar
                  id={post.createdBy.id}
                  name={post.createdBy.fullName}
                  src={post.createdBy.displayPhoto}
                />
              </Box>
              <Text color="status-disabled">{post.createdBy?.fullName}</Text>
            </Box>
            <Text color="status-disabled">
              {getTimezoneTimeFromUTC(post.createdOn).fromNow()}
            </Text>
          </ExtendedBox>
          <Box direction="row" justify="between" align="start">
            <Text size="large" weight="bold" color="brand">
              {post.title}
            </Text>
            <Box
              direction="row"
              align="center"
              gap="small"
              flex={{ shrink: 0 }}
              margin={{ left: 'small' }}
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
export default PostGridItem;
