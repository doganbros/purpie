import { nanoid } from 'nanoid';

export const messages: {
  id: string;
  name: string;
  avatarSrc: string;
  side: 'left' | 'right';
  message: string;
}[] = [
  {
    id: nanoid(),
    name: 'Jane Doe',
    avatarSrc: 'https://image.flaticon.com/icons/png/512/219/219969.png',
    side: 'left',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    id: nanoid(),
    name: 'John Doe',
    avatarSrc: 'https://image.flaticon.com/icons/png/512/3135/3135715.png',
    side: 'right',
    message: 'Maecenas aliquet massa quam, et cursus mi tristique in.',
  },
  {
    id: nanoid(),
    name: 'John Doe',
    avatarSrc: 'https://image.flaticon.com/icons/png/512/3135/3135715.png',
    side: 'right',
    message: 'Integer sit amet molestie elit.',
  },
  {
    id: nanoid(),
    name: 'Jane Doe',
    avatarSrc: 'https://image.flaticon.com/icons/png/512/219/219969.png',
    side: 'left',
    message: 'Fusce ac lectus rhoncus, placerat orci in, dictum risus.',
  },
  {
    id: nanoid(),
    name: 'John Doe',
    avatarSrc: 'https://image.flaticon.com/icons/png/512/3135/3135715.png',
    side: 'right',
    message: 'Nulla eleifend augue metus.',
  },
  {
    id: nanoid(),
    name: 'Jane Doe',
    avatarSrc: 'https://image.flaticon.com/icons/png/512/219/219969.png',
    side: 'left',
    message: 'Vestibulum suscipit bibendum pulvinar.',
  },
  {
    id: nanoid(),
    name: 'John Doe',
    avatarSrc: 'https://image.flaticon.com/icons/png/512/3135/3135715.png',
    side: 'right',
    message: 'Aliquam quis nibh finibus, aliquam nisl non, interdum arcu.',
  },
  {
    id: nanoid(),
    name: 'John Doe',
    avatarSrc: 'https://image.flaticon.com/icons/png/512/3135/3135715.png',
    side: 'right',
    message:
      'Aenean vulputate quam odio, a scelerisque odio euismod tincidunt.',
  },
  {
    id: nanoid(),
    name: 'Jane Doe',
    avatarSrc: 'https://image.flaticon.com/icons/png/512/219/219969.png',
    side: 'left',
    message: 'Aliquam mollis tempus orci nec dignissim.',
  },
  {
    id: nanoid(),
    name: 'Jane Doe',
    avatarSrc: 'https://image.flaticon.com/icons/png/512/219/219969.png',
    side: 'left',
    message: 'Sed finibus massa a dui ullamcorper tincidunt.',
  },
];
