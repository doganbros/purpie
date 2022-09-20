import React, { FC } from 'react';
import { Text, TextExtendedProps } from 'grommet';
import { AnchorLink } from './AnchorLink';

interface UserBadgeProps {
  firstName?: string;
  lastName?: string;
  url: string;
  textProps?: TextExtendedProps;
}

const UserBadge: FC<UserBadgeProps> = ({
  firstName,
  lastName,
  url,
  textProps,
}) => {
  return (
    <AnchorLink
      to={url}
      label={
        <Text {...textProps}>
          @ {firstName} {lastName}
        </Text>
      }
    />
  );
};

export default UserBadge;
