import React, { FC } from 'react';
import { Avatar, TextExtendedProps } from 'grommet';
import { useSelector } from 'react-redux';
import InitialsAvatar from './InitialsAvatar';
import { apiURL } from '../../../config/http';
import ExtendedBox from '../ExtendedBox';
import { AppState } from '../../../store/reducers/root.reducer';

interface AvatarItemProps {
  name?: string;
  src?: string;
  id: string;
  textProps?: TextExtendedProps;
  size?: string;
  round?: string;
  hasOnline?: boolean;
}

export const UserAvatar: FC<AvatarItemProps> = ({
  name,
  src,
  id,
  size,
  textProps,
  round,
  hasOnline = true,
}) => {
  const {
    chat: { usersOnline },
    auth: { user },
  } = useSelector((state: AppState) => state);

  const userOnline = hasOnline && usersOnline.includes(id) && user?.id !== id;

  return (
    <ExtendedBox position="relative">
      {src ? (
        <Avatar
          alignSelf="start"
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
      {userOnline && (
        <ExtendedBox
          position="absolute"
          minWidth="16px"
          minHeight="16px"
          background="#6DD400"
          bottom="0"
          right="-2px"
          round
          border={{ size: '1.5px', color: 'white' }}
        />
      )}
    </ExtendedBox>
  );
};
