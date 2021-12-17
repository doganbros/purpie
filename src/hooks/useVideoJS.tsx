import React, { useRef, useEffect, useState, FC, useCallback } from 'react';
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
  videoKey: string | number,
  options: videojs.PlayerOptions,
  classNames = ''
): {
  Video: FC;
  ready: boolean;
  player: videojs.Player | null;
} => {
  const videoNode = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const player = useRef<videojs.Player | null>(null);
  useEffect(() => {
    if (videoNode.current) {
      player.current = videojs(videoNode.current, {
        ...defaultOptions,
        ...options,
      });
      player.current.ready(() => {
        setReady(true);
      });
    }
    return () => {
      if (player.current) player.current.dispose();
    };
  }, [videoKey]);

  const Video = useCallback(
    ({ ...props }) => (
      <video
        key={videoKey}
        ref={videoNode}
        className={`video-js vjs-big-play-centered octopus-player ${classNames}`}
        {...props}
      />
    ),
    [videoKey]
  );

  return {
    Video,
    ready,
    player: player.current,
  };
};
