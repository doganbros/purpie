import { nanoid } from 'nanoid';
import videojs from 'video.js';

export const videoPlayerOptions: videojs.PlayerOptions = {
  autoplay: true,
  sources: [
    {
      src:
        'https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_h264.mov',
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
  details:
    'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.',
};
