import React, { FC } from 'react';
import { Avatar, TextExtendedProps } from 'grommet';
import InitialsAvatar from './InitialsAvatar';
import { apiURL } from '../../../config/http';

interface AvatarItemProps {
  name?: string;
  src?: string;
  onClickEdit?: () => void;
  editAvatar?: boolean;
  outerCircle?: boolean;
  id: number;
  textProps?: TextExtendedProps;
  size?: string;
}

export const ZoneAvatar: FC<AvatarItemProps> = ({
  name,
  src,
  id,
  size,
  ...textProps
}) =>
  src ? (
    <Avatar
      alignSelf="center"
      round="small"
      src={`${apiURL}/zone/display-photo/${src}`}
      background="red"
      size={size || 'medium'}
    />
  ) : (
    <InitialsAvatar
      id={id}
      value={name}
      textProps={textProps}
      roundSize="small"
      size={size || 'medium'}
    />
  );
