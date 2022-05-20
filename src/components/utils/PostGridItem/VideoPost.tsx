import { Box } from 'grommet';
import videojs from 'video.js';
import { Bookmark, PlayFill } from 'grommet-icons';
import React, { FC, useRef, useState } from 'react';
import { http } from '../../../config/http';
import { BookmarkFill } from '../CustomIcons';
import ExtendedBox from '../ExtendedBox';
import VideoJs from './VideoJs';

interface VideoPostProps {
  id: number;
  videoName: string;
  slug: string;
  live: boolean;
  saved: boolean;
  onClickSave: (id: number) => any;
}

const { REACT_APP_STREAMING_URL } = process.env;

export const VideoPost: FC<VideoPostProps> = ({
  id,
  videoName,
  slug,
  live,
  saved,
  onClickSave,
}) => {
  const player = useRef<videojs.Player | null>(null);
  const [hover, setHover] = useState(false);

  return (
    <ExtendedBox
      position="relative"
      onMouseEnter={() => {
        setHover(true);
        if (player.current) {
          player.current.play();
        }
      }}
      onMouseLeave={() => {
        setHover(false);
        if (player.current) {
          player.current.pause();
          player.current.currentTime(0);
        }
      }}
    >
      <VideoJs
        getPlayer={(p) => {
          player.current = p;
        }}
        options={{
          autoplay: false,
          muted: true,
          controlBar: false,
          controls: false,
          aspectRatio: '16:9',
          sources: [
            {
              src: live
                ? `${REACT_APP_STREAMING_URL}/${slug}.m3u8`
                : `${http.defaults.baseURL}/post/video/view/${slug}/${videoName}`,
              type: live ? 'application/x-mpegURL' : 'video/mp4',
            },
          ],
        }}
      />
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
            <BookmarkFill color="accent-1" />
          ) : (
            hover && <Bookmark color="status-disabled" />
          )}
        </Box>
      </ExtendedBox>
    </ExtendedBox>
  );
};
