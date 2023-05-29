import React, { FC, useState } from 'react';
import { Box, Stack, Text } from 'grommet';
import { Add, Chat, Favorite, Play } from 'grommet-icons';
import dayjs from 'dayjs';
import ExtendedBox from '../utils/ExtendedBox';
import { VideoPost } from './VideoPost';
import { ImagePost } from './ImagePost';
import { Post } from '../../store/types/post.types';
import { FavoriteFill } from '../utils/CustomIcons';
import { UserAvatar } from '../utils/Avatars/UserAvatar';
import * as MeetingService from '../../store/services/meeting.service';

interface PostGridItemProps {
  post: Post;
  onClickPlay: (id: string) => any;
}

const PostGridItem: FC<PostGridItemProps> = ({ post, onClickPlay }) => {
  const [hover, setHover] = useState(false);

  const getJoinLink = async () => {
    const meetingLink = await MeetingService.getMeetingJoinLink(post.slug);
    window.open(meetingLink, '_blank');
  };

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
                round="full"
                border={{ size: 'large', color: 'white' }}
                flex={{ shrink: 0 }}
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
              {dayjs(post.createdOn).fromNow()}
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
        {hover && (post.liveStream || post.streaming) && (
          <ExtendedBox position="absolute" top="64px" left="56px">
            <Box
              direction="row"
              align="center"
              gap="xsmall"
              onClick={getJoinLink}
            >
              <Box
                background="accent-4"
                round="small"
                pad={{ vertical: 'xsmall', horizontal: 'small' }}
              >
                <Add color="black" size="medium" />
              </Box>
              <Text size="large" color="white" weight="bolder">
                Join
              </Text>
            </Box>
          </ExtendedBox>
        )}
        {hover && post.liveStream && (
          <ExtendedBox position="absolute" top="64px" right="56px">
            <Box
              direction="row"
              align="center"
              gap="xsmall"
              onClick={() => {
                onClickPlay(post.id);
              }}
            >
              <Box
                background="white"
                round="small"
                pad={{ vertical: 'xsmall', horizontal: 'small' }}
              >
                <Play color="black" size="medium" />
              </Box>
              <Text size="large" color="white" weight="bolder">
                Watch
              </Text>
            </Box>
          </ExtendedBox>
        )}
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
