import React, { FC } from 'react';
import { Avatar, Box, Image, Text } from 'grommet';
import { Bookmark, Chat, Favorite } from 'grommet-icons';
import ExtendedBox from './ExtendedBox';

interface VideoGridItemProps {
  id: string;
  thumbnailSrc: string;
  live: boolean;
  saved: boolean;
  userAvatarSrc: string;
  userName: string;
  createdAt: string;
  videoTitle: string;
  likes: number;
  comments: number;
  tags: string[];
  onClick: (id: string) => any;
}

const VideoGridItem: FC<VideoGridItemProps> = ({
  id,
  thumbnailSrc,
  live,
  saved,
  userAvatarSrc,
  userName,
  createdAt,
  videoTitle,
  likes,
  comments,
  tags,
  onClick,
}) => (
  <Box
    onClick={() => onClick(id)}
    round={{ corner: 'top', size: 'medium' }}
    overflow="hidden"
    gap="small"
  >
    <Box>
      <ExtendedBox
        position="relative"
        height="0"
        direction="row"
        justify="between"
        pad="medium"
        margin={{ bottom: '-50px' }}
      >
        <Box>
          {live && (
            <Box
              flex={{ shrink: 0 }}
              width="12px"
              height="12px"
              background="accent-1"
              round
            />
          )}
        </Box>
        <Bookmark color={saved ? 'white' : 'status-disabled'} />
      </ExtendedBox>
      <Image src={thumbnailSrc} />
    </Box>
    <Box direction="row" align="center" justify="between">
      <Box direction="row" align="center">
        <Box
          margin={{ top: '-35px', left: '-3px' }}
          background="brand"
          round="large"
          border={{ size: 'large', color: 'white' }}
        >
          <Avatar round src={userAvatarSrc} />
        </Box>
        <Text color="status-disabled">{userName}</Text>
      </Box>
      <Text color="status-disabled">{createdAt}</Text>
    </Box>
    <Box direction="row" align="center" justify="between">
      <Text size="large" weight="bold" color="brand">
        {videoTitle}
      </Text>
      <Box direction="row" align="center" gap="small">
        <Favorite color="status-disabled" />
        <Text size="small" color="status-disabled">
          {likes}
        </Text>
        <Chat color="status-disabled" />
        <Text color="status-disabled">{comments}</Text>
      </Box>
    </Box>
    <Text>{live}</Text>
    <Text>{saved}</Text>
    <Text>{tags}</Text>
  </Box>
);

export default VideoGridItem;
