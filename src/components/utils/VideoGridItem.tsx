import React, { FC } from 'react';
import { Avatar, Box, Text } from 'grommet';
import { Bookmark, Chat, Favorite } from 'grommet-icons';
import ExtendedBox from './ExtendedBox';
import VideoPlayer from './video/VideoPlayer';
import { http } from '../../config/http';

interface VideoGridItemProps {
  id: number;
  slug: string;
  live: boolean;
  saved: boolean;
  userAvatarSrc: string;
  userName: string;
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
  userName,
  createdAt,
  videoTitle,
  videoName,
  likes,
  comments,
  tags,
  onClickPlay,
  onClickSave,
}) => {
  const [hover, setHover] = React.useState(false);
  return (
    <Box
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      onClick={() => {
        onClickPlay(id);
      }}
      round={{ corner: 'top', size: 'medium' }}
      overflow="hidden"
      gap="small"
    >
      <ExtendedBox position="relative">
        <VideoPlayer
          options={{
            autoplay: false,
            sources: [
              {
                src: `${http.defaults.baseURL}/post/video/view/${slug}/${videoName}`,
                type: 'video/mp4',
              },
            ],
          }}
        />
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
            <Avatar round src={userAvatarSrc} />
          </Box>
          <Text color="status-disabled">{userName}</Text>
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
