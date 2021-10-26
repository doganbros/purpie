import React, { useRef, useEffect, forwardRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import './video-player.css';

interface VideoPlayerProps {
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

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ options }, ref) => {
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
        ref={(node) => {
          videoNode.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            // eslint-disable-next-line no-param-reassign
            ref.current = node;
          }
        }}
        className="video-js vjs-big-play-centered octopus-player"
        playsInline
      />
    );
  }
);

export default VideoPlayer;
