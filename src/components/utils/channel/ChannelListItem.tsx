import React, { FC } from 'react';
import { Avatar, Box, Button, Text } from 'grommet';

interface ChannelListItemProps {
  id: number;
  name: string;
  src: string;
}

const ChannelListItem: FC<ChannelListItemProps> = ({ id, name, src }) => (
  <Box direction="row" justify="between" align="center">
    <Box direction="row" align="center" gap="small">
      <Avatar size="medium" src={src} />
      <Box>
        <Text size="small" weight="bold">
          {name}
        </Text>
        <Text size="xsmall" color="status-disabled">
          {id}
        </Text>
      </Box>
    </Box>
    <Button primary label="Follow" size="small" />
  </Box>
);

export default ChannelListItem;
