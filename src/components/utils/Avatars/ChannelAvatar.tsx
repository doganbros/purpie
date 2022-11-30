import React, { FC } from 'react';
import { Avatar, TextExtendedProps } from 'grommet';
import InitialsAvatar from './InitialsAvatar';
import { apiURL } from '../../../config/http';

interface ChannelAvatarProps {
  name?: string;
  src?: string;
  id: number;
  textProps?: TextExtendedProps;
}

export const ChannelAvatar: FC<ChannelAvatarProps> = ({
  name,
  src,
  id,
  ...textProps
}) =>
  src ? (
    <Avatar
      alignSelf="center"
      round="full"
      src={`${apiURL}/channel/display-photo/${src}`}
    />
  ) : (
    <InitialsAvatar id={id} value={name} textProps={textProps} />
  );
