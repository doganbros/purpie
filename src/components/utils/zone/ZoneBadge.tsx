import React, { FC } from 'react';
import { Anchor, Box, Text } from 'grommet';
import { navigateToSubdomain } from '../../../helpers/app-subdomain';

interface ZoneBadgeProps {
  name?: string;
  subdomain?: string;
}

const ZoneBadge: FC<ZoneBadgeProps> = ({ name, subdomain }) => {
  return (
    <Anchor
      onClick={() => navigateToSubdomain(subdomain)}
      label={
        <Box gap="xsmall" align="center" direction="row">
          <Text size="18px">▣</Text>
          {name}
        </Box>
      }
      size="15px"
    />
  );
};

export default ZoneBadge;
