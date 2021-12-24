import { Box } from 'grommet';
import { Bookmark, PlayFill } from 'grommet-icons';
import { nanoid } from 'nanoid';
import React, { FC, useState } from 'react';
import { http } from '../../../config/http';
import { useVideoJS } from '../../../hooks/useVideoJS';
import { BookmarkFill } from '../CustomIcons';
import ExtendedBox from '../ExtendedBox';

interface VideoPostProps {
  id: number;
  videoName: string;
  slug: string;
  live: boolean;
  saved: boolean;
  onClickSave: (id: number) => any;
}

export const VideoPost: FC<VideoPostProps> = ({
  id,
  videoName,
  slug,
  live,
  saved,
  onClickSave,
}) => {
  const [videoKey] = useState(nanoid());
  const { Video, player } = useVideoJS(videoKey, {
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
  const [hover, setHover] = useState(false);

  return (
    <ExtendedBox
      position="relative"
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
    >
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
          focusIndicator={false}
          onClick={(e) => {
            e.stopPropagation();
            onClickSave(id);
          }}
        >
          {saved ? (
            <BookmarkFill color="white" />
          ) : (
            hover && <Bookmark color="status-disabled" />
          )}
        </Box>
      </ExtendedBox>
    </ExtendedBox>
  );
};
