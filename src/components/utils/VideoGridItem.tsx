import React, { FC, useState } from 'react';
import { Avatar, Box, Text } from 'grommet';
import { Bookmark, Chat, Favorite, PlayFill } from 'grommet-icons';
import ExtendedBox from './ExtendedBox';
import { useVideoJS } from '../../hooks/useVideoJS';
import { http } from '../../config/http';
import { UserBasic } from '../../store/types/auth.types';
import InitialsAvatar from './InitialsAvatar';

interface VideoGridItemProps {
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
  tags: { id: number; value: string }[];
  onClickPlay: (id: number) => any;
  onClickSave: (id: number) => any;
}

const VideoGridItem: FC<VideoGridItemProps> = ({
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
  tags,
  onClickPlay,
  onClickSave,
}) => {
  const [hover, setHover] = useState(false);

  const { Video, player } = useVideoJS({
    autoplay: false,
    muted: true,
    controlBar: false,
    controls: false,
    sources: [
      {
        src: `${http.defaults.baseURL}/post/video/view/${slug}/${videoName}`,
        type: 'video/mp4',
      },
    ],
  });

  return (
    <Box
      onMouseEnter={() => {
        setHover(true);
        if (player) {
          player.play();
        }
      }}
      onMouseLeave={() => {
        setHover(false);
        if (player) {
          player.pause();
          player.currentTime(0);
        }
      }}
      onClick={() => {
        onClickPlay(id);
      }}
      round={{ corner: 'top', size: 'medium' }}
      overflow="hidden"
      gap="small"
    >
      <ExtendedBox position="relative">
        <Video />
        <ExtendedBox
          position="absolute"
          top="0"
          bottom="0"
          left="0"
          right="0"
          margin="auto"
          justify="center"
          align="center"
        >
          {hover && <PlayFill size="xlarge" color="brand" />}
        </ExtendedBox>
        <ExtendedBox
          position="absolute"
          top="0"
          left="0"
          right="0"
          direction="row"
          justify="between"
          margin={{ bottom: '-50px' }}
        >
          <Box pad="medium">
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
          <Box
            pad="small"
            margin="small"
            onClick={(e) => {
              e.stopPropagation();
              onClickSave(id);
            }}
          >
            {saved ? (
              <Bookmark color="white" />
            ) : (
              hover && <Bookmark color="status-disabled" />
            )}
          </Box>
        </ExtendedBox>
      </ExtendedBox>

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
      <Box direction="row" gap="small">
        {tags.map((t) => (
          <Text key={t.id} color="status-disabled" size="small">
            #{t.value}
          </Text>
        ))}
      </Box>
    </Box>
  );
};
export default VideoGridItem;
