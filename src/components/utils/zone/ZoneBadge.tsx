import React, { FC } from 'react';
import { Anchor, Text, TextExtendedProps, ThemeContext } from 'grommet';
import { navigateToSubdomain } from '../../../helpers/app-subdomain';

interface ZoneBadgeProps {
  name?: string;
  subdomain?: string;
  textProps?: TextExtendedProps;
  truncateWith?: number;
}
const ZoneBadge: FC<ZoneBadgeProps> = ({
  name,
  subdomain,
  truncateWith,
  textProps,
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
      <Anchor
        onClick={() => navigateToSubdomain(subdomain)}
        label={
          truncateWith ? (
            <Text {...textProps}>
              ▣{' '}
              {name && name?.length > truncateWith
                ? `${name?.slice(0, truncateWith)}.`
                : name}
            </Text>
          ) : (
            <Text {...textProps}>▣ {name}</Text>
          )
        }
      />
    </ThemeContext.Extend>
  );
};

export default ZoneBadge;
