import React, { FC } from 'react';
import { Anchor, Text, TextExtendedProps, ThemeContext } from 'grommet';
import { navigateToSubdomain } from '../../../helpers/app-subdomain';

interface ZoneBadgeProps {
  name?: string;
  subdomain?: string;
  textProps?: TextExtendedProps;
  truncate?: boolean;
}
const ZoneBadge: FC<ZoneBadgeProps> = ({
  name,
  subdomain,
  truncate,
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
          truncate ? (
            <Text {...textProps}>▣ {`${name?.slice(0, 15)}.`}</Text>
          ) : (
            <Text {...textProps}>▣ {name}</Text>
          )
        }
      />
    </ThemeContext.Extend>
  );
};

export default ZoneBadge;
