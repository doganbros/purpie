import React, { FC } from 'react';
import { Avatar, Box, Button, Text } from 'grommet';

interface ZoneListItemProps {
  name: string;
  channelCount: number;
  memberCount: number;
  src: string;
}
const ZoneListItem: FC<ZoneListItemProps> = ({
  name,
  channelCount,
  memberCount,
  src,
}) => (
  <Box direction="row" justify="between" align="center">
    <Box direction="row" align="center" gap="small">
      <Avatar size="medium" src={src} />
      <Box>
        <Text size="small" weight="bold">
          {name}
        </Text>
        <Text size="xsmall" color="status-disabled">
          {`${channelCount} channels`}
        </Text>
        <Text size="xsmall" color="status-disabled">
          {`${memberCount} members`}
        </Text>
      </Box>
    </Box>
    <Button primary label="Follow" size="small" />
  </Box>
);

export default ZoneListItem;
