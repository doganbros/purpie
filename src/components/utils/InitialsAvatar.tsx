import React, { FC } from 'react';
import { Avatar } from 'grommet';
import { UserBasic } from '../../store/types/auth.types';

interface InitialsAvatarProps {
  user: UserBasic;
}

const getColorFromId = (id: number): string => {
  const colors = [
    'neutral-1',
    'neutral-2',
    'neutral-3',
    'neutral-4',
    'accent-1',
    'accent-2',
    'accent-3',
    'accent-4',
  ];
  return colors[id % colors.length];
};
const InitialsAvatar: FC<InitialsAvatarProps> = ({ user }) => (
  <Avatar round background={getColorFromId(user.id)}>
    {user?.firstName[0]}
    {user?.lastName[0]}
  </Avatar>
);

export default InitialsAvatar;
