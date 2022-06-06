import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { AnchorLink } from '../AnchorNavLink';

interface ChannelBadgeProps {
  name?: string;
  url: string;
}

const ChannelBadge: FC<ChannelBadgeProps> = ({ name, url }) => {
  return (
    <AnchorLink
      to={url}
      label={
        <Box gap="xsmall" align="center" direction="row">
          <Text size="18px">◉</Text>
          {name}
        </Box>
      }
      size="15px"
    />
  );
};

export default ChannelBadge;
