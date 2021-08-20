import React, { FC, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import ZoneListItem from '../../../components/utils/zone/ZoneListItem';

const zones = [
  {
    id: '#Zone1',
    name: 'Zone-1',
    channelCount: 41,
    memberCount: 245,
    src: 'https://image.flaticon.com/icons/png/512/4568/4568785.png',
  },
  {
    id: '#Zone2',
    name: 'Zone-2',
    channelCount: 31,
    memberCount: 3245,
    src: 'https://image.flaticon.com/icons/png/512/4568/4568755.png',
  },

  {
    id: '#Zone3',
    name: 'Zone-3',
    channelCount: 44,
    memberCount: 143,
    src: 'https://image.flaticon.com/icons/png/512/4568/4568773.png',
  },

  {
    id: '#Zone4',
    name: 'Zone-4',
    channelCount: 5,
    memberCount: 23,
    src: 'https://image.flaticon.com/icons/png/512/4569/4569967.png',
  },

  {
    id: '#Zone5',
    name: 'Zone-5',
    channelCount: 48,
    memberCount: 245,
    src: 'https://image.flaticon.com/icons/png/512/4568/4568719.png',
  },

  {
    id: '#Zone6',
    name: 'Zone-6',
    channelCount: 61,
    memberCount: 245,
    src: 'https://image.flaticon.com/icons/png/512/4568/4568857.png',
  },
  {
    id: '#Zone7',
    name: 'Zone-7',
    channelCount: 41,
    memberCount: 245,
    src: 'https://image.flaticon.com/icons/png/512/4570/4570037.png',
  },
  {
    id: '#Zone8',
    name: 'Zone-8',
    channelCount: 31,
    memberCount: 3245,
    src: 'https://image.flaticon.com/icons/png/512/4568/4568701.png',
  },

  {
    id: '#Zone9',
    name: 'Zone-9',
    channelCount: 44,
    memberCount: 143,
    src: 'https://image.flaticon.com/icons/png/512/4570/4570032.png',
  },

  {
    id: '#Zone10',
    name: 'Zone-10',
    channelCount: 5,
    memberCount: 23,
    src: 'https://image.flaticon.com/icons/png/512/4568/4568865.png',
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
            {displayCount === 3 ? 'See more' : 'See less'}
          </Text>
        </Button>
      </Box>
      {zones.slice(0, displayCount).map((z) => (
        <ZoneListItem
          key={z.id}
          name={z.name}
          channelCount={z.channelCount}
          memberCount={z.memberCount}
          src={z.src}
        />
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

export default ZonesToJoin;
