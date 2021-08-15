import React, { FC, useState } from 'react';
import { Avatar, Box, Button, Text } from 'grommet';

const channels = [
  {
    id: '#channel1',
    name: 'channel-1',
    bg: 'dark-1',
  },
  {
    id: '#channel2',
    name: 'channel-2',
    bg: 'dark-2',
  },

  {
    id: '#channel3',
    name: 'channel-3',
    bg: 'dark-3',
  },

  {
    id: '#channel4',
    name: 'channel-4',
    bg: 'dark-4',
  },

  {
    id: '#channel5',
    name: 'channel-5',
    bg: 'light-6',
  },

  {
    id: '#channel6',
    name: 'channel-6',
    bg: 'light-5',
  },
  {
    id: '#channel7',
    name: 'channel-7',
    bg: 'dark-3',
  },

  {
    id: '#channel8',
    name: 'channel-8',
    bg: 'dark-4',
  },

  {
    id: '#channel9',
    name: 'channel-9',
    bg: 'light-6',
  },

  {
    id: '#channel10',
    name: 'channel-10',
    bg: 'light-5',
  },
];
const ChannelsToFollow: FC = () => {
  const [displayCount, setDisplayCount] = useState(3);
  return (
    <Box gap="small">
      <Box direction="row" align="center" justify="between">
        <Text size="small" weight="bold">
          Channels to follow
        </Text>
        <Button
          onClick={() => {
            setDisplayCount((ps) => (ps === 3 ? 10 : 3));
          }}
        >
          <Text size="small" color="brand">
            {displayCount === 3 ? 'See more' : 'See less'}
          </Text>
        </Button>
      </Box>
      {channels.slice(0, displayCount).map((c) => (
        <Box key={c.id} direction="row" justify="between" align="center">
          <Box direction="row" align="center" gap="small">
            <Avatar size="medium" background={c.bg} />
            <Box>
              <Text size="small" weight="bold">
                {c.name}
              </Text>
              <Text size="xsmall" color="status-disabled">
                {c.id}
              </Text>
            </Box>
          </Box>
          <Button primary label="Follow" size="small" />
        </Box>
      ))}
      {displayCount > 3 && (
        <Button alignSelf="end">
          <Text size="small" color="brand">
            See all
          </Text>
        </Button>
      )}
    </Box>
  );
};

export default ChannelsToFollow;
