import React, { useRef, useEffect, useState, useCallback } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '../scss/video-player.css';

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
  Video: ({ children, ...props }: any) => JSX.Element;
  ready: boolean;
  player: videojs.Player | null;
} => {
  const videoNode = useRef<HTMLVideoElement | null>(null);
  const [ready, setReady] = useState(false);
  const changedKey = JSON.stringify({ ...defaultOptions, ...videoJsOptions });
  const player = useRef<videojs.Player | null>(null);
  useEffect(() => {
    player.current = videojs(videoNode.current || '', {
      ...defaultOptions,
      ...videoJsOptions,
    });
    player.current.ready(() => {
      setReady(true);
    });
    return () => {
      if (player.current) player.current.dispose();
    };
  }, [changedKey]);

  const Video = useCallback(
    ({ ...props }) => (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video
        key={changedKey}
        ref={videoNode}
        className={`video-js vjs-big-play-centered octopus-player ${classNames}`}
        {...props}
      />
    ),
    [changedKey]
  );
  return { Video, ready, player: player.current };
};
