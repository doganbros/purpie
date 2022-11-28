import React, { FC } from 'react';
import { Avatar, TextExtendedProps } from 'grommet';
import { useSelector } from 'react-redux';
import InitialsAvatar from './InitialsAvatar';
import { apiURL } from '../../../config/http';
import { AppState } from '../../../store/reducers/root.reducer';

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
}) => {
  const {
    auth: { user },
  } = useSelector((state: AppState) => state);
  const avatarUrl = user?.displayPhoto ? user?.displayPhoto : null;
  const AvatarComponent = () => {
    if (src === null) {
      return (
        <InitialsAvatar
          id={id}
          value={name}
          textProps={textProps}
          size={size || 'medium'}
        />
      );
    }
    if (src) {
      return (
        <Avatar
          alignSelf="center"
          round="full"
          src={`${apiURL}/user/display-photo/${src}`}
          size={size || 'medium'}
        />
      );
    }
    return (
      <Avatar
        alignSelf="center"
        round="full"
        src={`${apiURL}/user/display-photo/${avatarUrl}`}
        size={size || 'medium'}
      />
    );
  };
  return <AvatarComponent />;
};
