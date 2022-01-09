import React, { FC } from 'react';
import { Avatar } from 'grommet';
import { UserBasic } from '../../store/types/auth.types';
import { getColorPairFromId } from '../../helpers/utils';

interface InitialsAvatarProps {
  user?: UserBasic;
}

const InitialsAvatar: FC<InitialsAvatarProps> = ({ user }) =>
  user ? (
    <Avatar round background={getColorPairFromId(user.id)}>
      {user?.firstName[0]}
      {user?.lastName[0]}
    </Avatar>
  ) : (
    <Avatar round background="#eee" />
  );
export default InitialsAvatar;
