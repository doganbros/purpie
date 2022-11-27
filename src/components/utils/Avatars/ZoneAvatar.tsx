import React, { FC } from 'react';
import { Avatar, TextExtendedProps } from 'grommet';
import { useSelector } from 'react-redux';
import InitialsAvatar from './InitialsAvatar';
import { apiURL } from '../../../config/http';
import { AppState } from '../../../store/reducers/root.reducer';

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
}) => {
  const {
    zone: {
      getUserZones: { userZones },
    },
  } = useSelector((state: AppState) => state);
  const zoneAvatarUrl = userZones?.filter(
    (userZone) => userZone.zone.name === name
  )[0].zone.displayPhoto;
  const AvatarComponent = () => {
    if (src === null || src === undefined) {
      return (
        <InitialsAvatar
          id={id}
          value={name}
          textProps={textProps}
          roundSize="small"
          size={size || 'medium'}
        />
      );
    }
    if (src) {
      return (
        <Avatar
          alignSelf="center"
          round="small"
          src={`${apiURL}/zone/display-photo/${src}`}
          background="red"
          size={size || 'medium'}
        />
      );
    }
    return (
      <Avatar
        alignSelf="center"
        round="small"
        src={`${apiURL}/zone/display-photo/${zoneAvatarUrl}`}
        background="red"
        size={size || 'medium'}
      />
    );
  };
  return <AvatarComponent />;
};
