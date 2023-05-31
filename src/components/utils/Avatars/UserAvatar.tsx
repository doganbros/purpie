import React, { FC } from 'react';
import { Avatar, TextExtendedProps } from 'grommet';
import InitialsAvatar from './InitialsAvatar';
import { apiURL } from '../../../config/http';
import ExtendedBox from '../ExtendedBox';

interface AvatarItemProps {
  name?: string;
  src?: string;
  id: string;
  textProps?: TextExtendedProps;
  size?: string;
  round?: string;
  online?: boolean;
}

export const UserAvatar: FC<AvatarItemProps> = ({
  name,
  src,
  id,
  size,
  textProps,
  round,
  online,
}) => {
  return (
    <ExtendedBox position="relative">
      {src ? (
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
      )}
      {online && (
        <ExtendedBox
          position="absolute"
          minWidth="16px"
          minHeight="16px"
          background="#6DD400"
          bottom="-2px"
          right="-2px"
          round
          border={{ size: '1.5px', color: 'white' }}
        />
      )}
    </ExtendedBox>
  );
};
