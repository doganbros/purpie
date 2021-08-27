import { nanoid } from 'nanoid';

export const timeLineList = Array(20)
  .fill(null)
  .map(() => ({
    id: nanoid(),
    comments: Math.floor(Math.random() * 100),
    createdAt: '4:30 PM',
    likes: Math.floor(Math.random() * 30),
    saved: Math.random() < 0.5,
    live: Math.random() < 0.5,
    tags: [
      { id: 1, title: '#animals' },
      { id: 2, title: '#sea' },
      { id: 3, title: '#octopus' },
    ],
    thumbnailSrc:
      'https://images.unsplash.com/photo-1601511902608-bd1d92d0edb5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=stephanie-harlacher-cBHt4js8nVQ-unsplash.jpg&w=1920',
    userAvatarSrc: 'https://image.flaticon.com/icons/png/512/4721/4721623.png',
    userName: 'Jane Doe',
    videoTitle: 'Information About Octopuses',
    onClickPlay: (history: any) => {
      history.push(`video/${nanoid()}`);
    },
    onClickSave: () => {},
  }));
