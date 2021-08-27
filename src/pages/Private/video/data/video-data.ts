import { nanoid } from 'nanoid';
import videojs from 'video.js';

export const videoPlayerOptions: videojs.PlayerOptions = {
  autoplay: true,
  sources: [
    {
      src:
        'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'video/mp4',
    },
  ],
};

export const videoMetadata = {
  name: 'Big Buck Bunny',
  tags: [
    { id: nanoid(), name: '#blender' },
    { id: nanoid(), name: '#independent' },
    { id: nanoid(), name: '#animated' },
  ],
  date: '10.04.2008',
  likes: 721,
  comments: 402,
  views: 234290,
};
