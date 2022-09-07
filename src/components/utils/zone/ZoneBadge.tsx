import React, { FC } from 'react';
import { Anchor, Text, TextExtendedProps } from 'grommet';
import { navigateToSubdomain } from '../../../helpers/app-subdomain';

interface ZoneBadgeProps {
  name?: string;
  subdomain?: string;
  textProps?: TextExtendedProps;
}
const ZoneBadge: FC<ZoneBadgeProps> = ({ name, subdomain, textProps }) => {
  return (
    <Anchor
      onClick={() => navigateToSubdomain(subdomain)}
      label={<Text {...textProps}>▣ {name}</Text>}
    />
  );
};

export default ZoneBadge;
