import React, { FC, useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './video-player.css';

interface IVideoPlayerProps {
  options: videojs.PlayerOptions;
}

const initialOptions: videojs.PlayerOptions = {
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

const VideoPlayer: FC<IVideoPlayerProps> = ({ options }) => {
  const videoNode = useRef<HTMLVideoElement | null>(null);
  const player = useRef<videojs.Player>();

  useEffect(() => {
    player.current = videojs(videoNode.current || '', {
      ...initialOptions,
      ...options,
    }).ready(() => {});
    return () => {
      if (player.current) {
        player.current.dispose();
      }
    };
  }, [options]);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={videoNode}
      className="video-js vjs-big-play-centered octopus-player"
      playsInline
    />
  );
};

export default VideoPlayer;
