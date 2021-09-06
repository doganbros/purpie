import React, { FC } from 'react';
import { Avatar, Box, Button, Text } from 'grommet';

interface ChannelListItemProps {
  id: number;
  zoneSubdomain: string;
  name: string;
  src: string;
}

const ChannelListItem: FC<ChannelListItemProps> = ({
  // id,
  name,
  src,
  zoneSubdomain,
}) => (
  <Box direction="row" justify="between" align="center">
    <Box direction="row" align="center" gap="small">
      <Avatar size="medium" src={src} />
      <Box>
        <Text size="small" weight="bold">
          {name}
        </Text>
        <Text size="xsmall" color="status-disabled">
          {zoneSubdomain}
        </Text>
      </Box>
    </Box>
    <Button primary label="Follow" size="small" />
  </Box>
);

export default ChannelListItem;
