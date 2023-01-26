import React, { FC } from 'react';
import { Avatar, TextExtendedProps } from 'grommet';
import InitialsAvatar from './InitialsAvatar';
import { apiURL } from '../../../config/http';

interface ChannelAvatarProps {
  name?: string;
  src?: string;
  id: string;
  textProps?: TextExtendedProps;
  size?: string;
}

export const ChannelAvatar: FC<ChannelAvatarProps> = ({
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
      src={`${apiURL}/channel/display-photo/${src}`}
      flex={{ shrink: 0 }}
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
