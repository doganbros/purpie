import React, { FC } from 'react';
import { Avatar, Box, Text } from 'grommet';
import { Chat, Favorite } from 'grommet-icons';
import ExtendedBox from '../ExtendedBox';
import { UserBasic } from '../../../store/types/auth.types';
import InitialsAvatar from '../InitialsAvatar';
import { VideoPost } from './VideoPost';
import { ImagePost } from './ImagePost';

interface PostGridItemProps {
  id: number;
  slug: string;
  live: boolean;
  saved: boolean;
  userAvatarSrc?: string;
  createdBy: UserBasic;
  createdAt: string;
  videoTitle: string;
  videoName: string;
  likes: string;
  comments: string;
  onClickPlay: (id: number) => any;
  onClickSave: (id: number) => any;
}

const PostGridItem: FC<PostGridItemProps> = ({
  id,
  slug,
  live,
  saved,
  userAvatarSrc,
  createdBy,
  createdAt,
  videoTitle,
  videoName,
  likes,
  comments,
  onClickPlay,
  onClickSave,
}) => {
  return (
    <Box
      onClick={() => {
        onClickPlay(id);
      }}
      focusIndicator={false}
      round={{ corner: 'top', size: 'medium' }}
      overflow="hidden"
      gap="small"
    >
      {videoName ? (
        <VideoPost
          id={id}
          live={live}
          onClickSave={onClickSave}
          saved={saved}
          slug={slug}
          videoName={videoName}
        />
      ) : (
        <ImagePost />
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
            {userAvatarSrc ? (
              <Avatar round src={userAvatarSrc} />
            ) : (
              <InitialsAvatar user={createdBy} />
            )}
          </Box>
          <Text color="status-disabled">
            {createdBy?.firstName} {createdBy?.lastName}
          </Text>
        </Box>
        <Text color="status-disabled">{createdAt}</Text>
      </ExtendedBox>
      <Box direction="row" justify="between" align="start">
        <Text size="large" weight="bold" color="brand">
          {videoTitle}
        </Text>
        <Box
          direction="row"
          align="center"
          gap="small"
          flex={{ shrink: 0 }}
          margin={{ left: 'small' }}
        >
          <Favorite color="status-disabled" />
          <Text size="small" color="status-disabled">
            {likes}
          </Text>
          <Chat color="status-disabled" />
          <Text color="status-disabled">{comments}</Text>
        </Box>
      </Box>
    </Box>
  );
};
export default PostGridItem;
