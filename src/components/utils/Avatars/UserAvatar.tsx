import React, { FC } from 'react';
import { Avatar, TextExtendedProps } from 'grommet';
import InitialsAvatar from './InitialsAvatar';
import { apiURL } from '../../../config/http';

interface AvatarItemProps {
  name?: string;
  src?: string;
  id: string;
  textProps?: TextExtendedProps;
  size?: string;
  round?: string;
}

export const UserAvatar: FC<AvatarItemProps> = ({
  name,
  src,
  id,
  size,
  textProps,
  round,
}) =>
  src ? (
    <Avatar
      alignSelf="center"
      round={round || 'full'}
      src={`${apiURL}/user/display-photo/${src}`}
      size={size || 'medium'}
    />
  ) : (
    <InitialsAvatar
      id={id}
      value={name}
      textProps={textProps}
      round={round}
      size={size || 'medium'}
    />
  );
