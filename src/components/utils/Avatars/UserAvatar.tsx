import React, { FC } from 'react';
import { Avatar, TextExtendedProps } from 'grommet';
import InitialsAvatar from './InitialsAvatar';
import { apiURL } from '../../../config/http';

interface AvatarItemProps {
  name?: string;
  src?: string;
  id: number;
  textProps?: TextExtendedProps;
  size?: string;
}

export const UserAvatar: FC<AvatarItemProps> = ({
  name,
  src,
  id,
  size,
  ...textProps
}) =>
  src ? (
    <Avatar
      alignSelf="center"
      round="full"
      src={`${apiURL}/user/display-photo/${src}`}
      size={size || 'medium'}
    />
  ) : (
    <InitialsAvatar
      id={id}
      value={name}
      textProps={textProps}
      size={size || 'medium'}
    />
  );
