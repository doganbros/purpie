import React, { FC, useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '../../styles/video-player.scss';

interface Props {
  classNames?: string;
  options: videojs.PlayerOptions;
  getPlayer?: (player: videojs.Player) => void;
  onReady?: () => void;
}

const VideoJs: FC<Props> = ({
  classNames = '',
  getPlayer,
  options,
  onReady,
}) => {
  const player = useRef<videojs.Player | null>(null);
  const videoNode = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoNode.current) {
      player.current = videojs(videoNode.current, options);

      if (getPlayer) getPlayer(player.current);

      if (onReady) onReady();
    }

    return () => {
      if (player.current) player.current.dispose();
    };
  }, []);

  return (
    <video
      ref={videoNode}
      className={`video-js vjs-big-play-centered octopus-player ${classNames}`}
    />
  );
};

export default VideoJs;
