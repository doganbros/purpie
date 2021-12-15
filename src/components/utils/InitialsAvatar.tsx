import React, { FC } from 'react';
import { Avatar } from 'grommet';
import { UserBasic } from '../../store/types/auth.types';
import avatarColors from '../../styles/avatar-colors.json';

interface InitialsAvatarProps {
  user?: UserBasic;
}

const getColorFromId = (id: number): typeof avatarColors[0] => {
  return avatarColors[id % avatarColors.length];
};
const InitialsAvatar: FC<InitialsAvatarProps> = ({ user }) =>
  user ? (
    <Avatar round background={getColorFromId(user.id)}>
      {user?.firstName[0]}
      {user?.lastName[0]}
    </Avatar>
  ) : (
    <Avatar round background="#eee" />
  );
export default InitialsAvatar;
