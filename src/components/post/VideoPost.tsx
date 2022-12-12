import { Box } from 'grommet';
import videojs from 'video.js';
import React, { FC, useRef, useState } from 'react';
import { Bookmark } from 'grommet-icons';
import { http } from '../../config/http';
import ExtendedBox from '../utils/ExtendedBox';
import VideoJs from './VideoJs';
import { AddToFolderDrop } from '../../layers/saved-video/folder/AddToFolderDrop';
import { BookmarkFill } from '../utils/CustomIcons';

interface VideoPostProps {
  id: number;
  videoName: string;
  slug: string;
  live: boolean;
  savedIcon?: boolean;
}

const { REACT_APP_STREAMING_URL } = process.env;

export const VideoPost: FC<VideoPostProps> = ({
  id,
  videoName,
  slug,
  live,
  savedIcon = true,
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
        // setOpen(false);
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

        {savedIcon && (
          <Box pad="small" margin="small" focusIndicator={false}>
            {hover && (
              <AddToFolderDrop
                postId={id}
                dropLabels={(isActive) =>
                  isActive ? (
                    <BookmarkFill color="white" />
                  ) : (
                    <Bookmark color="white" />
                  )
                }
              />
            )}
          </Box>
        )}
      </ExtendedBox>
    </ExtendedBox>
  );
};
