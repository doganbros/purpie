import React, { FC, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import ChannelListItem from '../../../components/utils/channel/ChannelListItem';

const channels = [
  {
    id: '#channel1',
    name: 'channel-1',
    src: 'https://image.flaticon.com/icons/png/512/3969/3969733.png',
  },
  {
    id: '#channel2',
    name: 'channel-2',
    src: 'https://image.flaticon.com/icons/png/512/3969/3969743.png',
  },

  {
    id: '#channel3',
    name: 'channel-3',
    src: 'https://image.flaticon.com/icons/png/512/3969/3969722.png',
  },

  {
    id: '#channel4',
    name: 'channel-4',
    src: 'https://image.flaticon.com/icons/png/512/3969/3969724.png',
  },

  {
    id: '#channel5',
    name: 'channel-5',
    src: 'https://image.flaticon.com/icons/png/512/3969/3969727.png',
  },

  {
    id: '#channel6',
    name: 'channel-6',
    src: 'https://image.flaticon.com/icons/png/512/3969/3969730.png',
  },
  {
    id: '#channel7',
    name: 'channel-7',
    src: 'https://image.flaticon.com/icons/png/512/3969/3969735.png',
  },

  {
    id: '#channel8',
    name: 'channel-8',
    src: 'https://image.flaticon.com/icons/png/512/3969/3969738.png',
  },

  {
    id: '#channel9',
    name: 'channel-9',
    src: 'https://image.flaticon.com/icons/png/512/3969/3969741.png',
  },

  {
    id: '#channel10',
    name: 'channel-10',
    src: 'https://image.flaticon.com/icons/png/512/3969/3969747.png',
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
        <ChannelListItem key={c.id} id={c.id} name={c.name} src={c.src} />
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
