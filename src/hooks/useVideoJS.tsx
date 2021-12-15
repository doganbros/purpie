import { nanoid } from 'nanoid';
import React, { useRef, useEffect, useState, useCallback, FC } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '../styles/video-player.scss';

const defaultOptions: videojs.PlayerOptions = {
  autoplay: false,
  muted: false,
  controls: true,
  fluid: true,
  controlBar: {
    volumePanel: {
      inline: false,
    },
  },
};

export const useVideoJS = (
  videoJsOptions: videojs.PlayerOptions,
  classNames = ''
): {
  Video: FC;
  ready: boolean;
  player: videojs.Player | null;
} => {
  const videoNode = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const [videoKey, setVideoKey] = useState(nanoid());
  const options = JSON.stringify({ ...defaultOptions, ...videoJsOptions });
  const player = useRef<videojs.Player | null>(null);
  useEffect(() => {
    player.current = videojs(videoNode.current || '', {
      ...defaultOptions,
      ...videoJsOptions,
    });
    player.current.ready(() => {
      setReady(true);
    });
    setVideoKey(nanoid());
    return () => {
      if (player.current) player.current.dispose();
    };
  }, [options]);

  const Video = useCallback(
    ({ ...props }) => (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        key={videoKey}
        ref={videoNode}
        className={`video-js vjs-big-play-centered octopus-player ${classNames}`}
        {...props}
      />
    ),
    [options]
  );
  return { Video, ready, player: player.current };
};
