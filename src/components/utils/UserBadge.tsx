import React, { FC } from 'react';
import { Text, TextExtendedProps } from 'grommet';
import { AnchorLink } from './AnchorLink';

interface UserBadgeProps {
  fullName?: string;
  url: string;
  textProps?: TextExtendedProps;
}

const UserBadge: FC<UserBadgeProps> = ({ fullName, url, textProps }) => {
  return (
    <AnchorLink to={url} label={<Text {...textProps}>@ {fullName}</Text>} />
  );
};

export default UserBadge;
