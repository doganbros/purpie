import React, { FC, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import { Chat, Play, Favorite } from 'grommet-icons';
import {
  SUGGESTION_AMOUNT_LESS,
  SUGGESTION_AMOUNT_MORE,
} from '../../../helpers/constants';

const activities = [
  {
    id: 1,
    icon: <Chat />,
    message: "Maaike has commented on Philips' video",
  },
  {
    id: 2,
    icon: <Play />,
    message: 'Philips has started a live stream',
  },

  {
    id: 3,
    icon: <Favorite />,
    message: "Maaike has liked Leonita's post",
  },

  {
    id: 4,
    icon: <Chat />,
    message: "Maaike has commented on Leonita's video",
  },

  {
    id: 5,
    icon: <Favorite />,
    message: "Leonita has liked Maaike's video",
  },

  {
    id: 6,
    icon: <Play />,
    message: 'Jane has started a live stream',
  },
  {
    id: 7,
    icon: <Chat />,
    message: "Maaike has commented on Philips' video",
  },
  {
    id: 8,
    icon: <Play />,
    message: 'Philips has started a live stream',
  },

  {
    id: 9,
    icon: <Favorite />,
    message: "Maaike has liked Leonita's post",
  },

  {
    id: 10,
    icon: <Chat />,
    message: "Maaike has commented on Leonita's video",
  },

  {
    id: 11,
    icon: <Favorite />,
    message: "Leonita has liked Maaike's video",
  },
];

const LastActivities: FC = () => {
  const [displayCount, setDisplayCount] = useState(SUGGESTION_AMOUNT_LESS);
  return (
    <Box gap="small">
      <Box direction="row" align="center" justify="between">
        <Text size="small" weight="bold">
          Last Activities
        </Text>
        <Button
          onClick={() => {
            setDisplayCount((ps) =>
              ps === SUGGESTION_AMOUNT_LESS
                ? SUGGESTION_AMOUNT_MORE
                : SUGGESTION_AMOUNT_LESS
            );
          }}
        >
          <Text size="small" color="brand">
            {displayCount === SUGGESTION_AMOUNT_LESS ? 'See more' : 'See less'}
          </Text>
        </Button>
      </Box>
      {activities.slice(0, displayCount).map((a) => (
        <Box key={a.id} direction="row" justify="between" align="center">
          <Box direction="row" align="center" gap="small">
            {a.icon}
            <Text size="xsmall">{a.message}</Text>
          </Box>
        </Box>
      ))}
      {displayCount > SUGGESTION_AMOUNT_LESS && (
        <Button alignSelf="end">
          <Text size="small" color="brand">
            See all
          </Text>
        </Button>
      )}
    </Box>
  );
};

export default LastActivities;
