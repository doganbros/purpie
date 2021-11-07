import React, { FC } from 'react';
import { http } from '../../config/http';
import { useVideoJS } from '../../hooks/useVideoJS';

interface VideoPlayerProps {
  slug: string;
  videoName: string;
}

const VideoPlayer: FC<VideoPlayerProps> = ({ slug, videoName }) => {
  const { Video } = useVideoJS({
    sources: [
      {
        src: `${http.defaults.baseURL}/post/video/view/${slug}/${videoName}`,
        type: 'video/mp4',
      },
    ],
  });
  return <Video />;
};

export default VideoPlayer;
