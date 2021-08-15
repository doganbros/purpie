import React, { FC, useState } from 'react';
import { Avatar, Box, Button, Text } from 'grommet';

const zones = [
  {
    id: '#Zone1',
    name: 'Zone-1',
    channelCount: 41,
    memberCount: 245,
    bg: 'teal',
  },
  {
    id: '#Zone2',
    name: 'Zone-2',
    channelCount: 31,
    memberCount: 3245,
    bg: 'aqua',
  },

  {
    id: '#Zone3',
    name: 'Zone-3',
    channelCount: 44,
    memberCount: 143,
    bg: 'aquamarine',
  },

  {
    id: '#Zone4',
    name: 'Zone-4',
    channelCount: 5,
    memberCount: 23,
    bg: 'cadetblue',
  },

  {
    id: '#Zone5',
    name: 'Zone-5',
    channelCount: 48,
    memberCount: 245,
    bg: 'darkcyan',
  },

  {
    id: '#Zone6',
    name: 'Zone-6',
    channelCount: 61,
    memberCount: 245,
    bg: 'lightblue',
  },
];
const ZonesToJoin: FC = () => {
  const [displayCount, setDisplayCount] = useState(3);
  return (
    <Box gap="small">
      <Box direction="row" align="center" justify="between">
        <Text size="small" weight="bold">
          Zones to join
        </Text>
        <Button
          onClick={() => {
            setDisplayCount((ps) => (ps === 3 ? 10 : 3));
          }}
        >
          <Text size="small" color="brand">
            See all
          </Text>
        </Button>
      </Box>
      {zones.slice(0, displayCount).map((c) => (
        <Box key={c.id} direction="row" justify="between" align="center">
          <Box direction="row" align="center" gap="small">
            <Avatar size="medium" background={c.bg} />
            <Box>
              <Text size="small" weight="bold">
                {c.name}
              </Text>
              <Text size="xsmall" color="status-disabled">
                {`${c.channelCount} channels`}
              </Text>
              <Text size="xsmall" color="status-disabled">
                {`${c.memberCount} members`}
              </Text>
            </Box>
          </Box>
          <Button primary label="Follow" size="small" />
        </Box>
      ))}
    </Box>
  );
};

export default ZonesToJoin;
