import React, { FC } from 'react';
import { Anchor, TextExtendedProps, ThemeContext } from 'grommet';
import { navigateToSubdomain } from '../../../helpers/app-subdomain';
import EllipsesOverflowText from '../EllipsesOverflowText';

interface ZoneBadgeProps {
  name?: string;
  subdomain?: string;
  textProps?: TextExtendedProps;
  truncateWith?: string;
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
          <EllipsesOverflowText
            maxWidth={truncateWith || '210px'}
            text={`▣ ${name}`}
            lineClamp={1}
            {...textProps}
          />
        }
      />
    </ThemeContext.Extend>
  );
};

export default ZoneBadge;
