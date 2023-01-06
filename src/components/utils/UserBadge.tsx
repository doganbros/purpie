import React, { FC } from 'react';
import { Text, TextExtendedProps, ThemeContext } from 'grommet';
import { AnchorLink } from './AnchorLink';

interface UserBadgeProps {
  fullName?: string;
  url: string;
  textProps?: TextExtendedProps;
}

const UserBadge: FC<UserBadgeProps> = ({ fullName, url, textProps }) => {
  return (
    <ThemeContext.Extend
      value={{
        anchor: {
          hover: {
            textDecoration: 'none',
          },
        },
      }}
    >
      <AnchorLink to={url} label={<Text {...textProps}>@ {fullName}</Text>} />
    </ThemeContext.Extend>
  );
};

export default UserBadge;
