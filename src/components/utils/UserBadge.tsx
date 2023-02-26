import React, { FC } from 'react';
import { TextExtendedProps, ThemeContext } from 'grommet';
import { AnchorLink } from './AnchorLink';
import EllipsesOverflowText from './EllipsesOverflowText';

interface UserBadgeProps {
  fullName?: string;
  url: string;
  textProps?: TextExtendedProps;
  truncateWith?: string;
}

const UserBadge: FC<UserBadgeProps> = ({
  fullName,
  url,
  textProps,
  truncateWith,
}) => {
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
      <AnchorLink
        to={url}
        label={
          <EllipsesOverflowText
            maxWidth={truncateWith || '180px'}
            text={`@${fullName}`}
            lineClamp={1}
            {...textProps}
          />
        }
      />
    </ThemeContext.Extend>
  );
};

export default UserBadge;
