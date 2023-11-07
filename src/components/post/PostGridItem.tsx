import React, { FC, useState } from 'react';
import { Box, Stack, Text } from 'grommet';
import { Add, Play } from 'grommet-icons';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import ExtendedBox from '../utils/ExtendedBox';
import { VideoPost } from './VideoPost';
import { ImagePost } from './ImagePost';
import { Post } from '../../store/types/post.types';
import { UserAvatar } from '../utils/Avatars/UserAvatar';
import * as MeetingService from '../../store/services/meeting.service';
import EllipsesOverflowText from '../utils/EllipsesOverflowText';

interface PostGridItemProps {
  post: Post;
  onClickPlay: (id: string) => any;
}

const PostGridItem: FC<PostGridItemProps> = ({ post, onClickPlay }) => {
  const [hover, setHover] = useState(false);
  const history = useHistory();
  const { t } = useTranslation();

  const getJoinLink = async () => {
    const meetingLink = await MeetingService.getMeetingJoinLink(post.slug);
    window.open(meetingLink, '_blank');
  };

  const handleUserClick = () => {
    history.push(`user/${post.createdBy.userName}`);
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
          focusIndicator={false}
          round={{ size: 'medium' }}
          overflow="hidden"
          gap="small"
          pad={{ bottom: 'small' }}
        >
          {post.videoName || post.streaming ? (
            <VideoPost
              onClick={() => onClickPlay(post.id)}
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
            <Box
              direction="row"
              align="center"
              onClick={() => handleUserClick()}
            >
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
              <EllipsesOverflowText
                maxWidth="140px"
                textAlign="center"
                weight="bold"
                size="small"
                color="status-disabled"
                text={post.createdBy?.fullName}
              />
            </Box>
            <Text color="status-disabled">
              {dayjs(post.createdOn).fromNow()}
            </Text>
          </ExtendedBox>
          <Box direction="row" justify="between" align="start">
            <Box
              onClick={() => onClickPlay(post.id)}
              style={{ cursor: 'pointer' }}
            >
              <EllipsesOverflowText
                maxWidth="305px"
                size="large"
                weight="bold"
                color="brand"
                text={post.title}
              />
            </Box>
            {post.streaming ? (
              <Text>
                {post.postReaction.liveStreamViewersCount <= 1
                  ? t('Video.userWatching', {
                      count: post.postReaction.liveStreamViewersCount,
                    })
                  : t('Video.usersWatching', {
                      count: post.postReaction.liveStreamViewersCount,
                    })}
              </Text>
            ) : (
              <Text color="status-disabled">
                {t(
                  `Video.${
                    post.postReaction.viewsCount === 1
                      ? 'viewCount'
                      : 'viewsCount'
                  }`,
                  { count: post.postReaction.viewsCount }
                )}
              </Text>
            )}
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
