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
  id: string;
  textProps?: TextExtendedProps;
  size?: string;
}

export const ZoneAvatar: FC<AvatarItemProps> = ({
  name,
  src,
  id,
  size,
  ...textProps
}) => {
  const round = textProps?.textProps?.size;
  return src ? (
    <Avatar
      alignSelf="center"
      round={round || '15px'}
      src={`${apiURL}/zone/display-photo/${src}`}
      background="red"
      size={size || 'medium'}
      flex={{ shrink: 0 }}
    />
  ) : (
    <InitialsAvatar
      id={id}
      value={name}
      textProps={textProps}
      roundSize={round || '15px'}
      size={size || 'medium'}
    />
  );
};
