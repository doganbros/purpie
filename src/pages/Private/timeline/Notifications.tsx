import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Text } from 'grommet';
// import { Chat, Play, Favorite } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  SUGGESTION_AMOUNT_LESS,
  SUGGESTION_AMOUNT_MORE,
} from '../../../helpers/constants';
import {
  getNotificationsAction,
  getNotificationCountAction,
} from '../../../store/actions/activity.action';
import { AppState } from '../../../store/reducers/root.reducer';

// TODO: bthnorhan remove dummy data.
// const activities = [
//   {
//     id: 1,
//     icon: <Chat />,
//     message: "Maaike has commented on Philips' video",
//   },
//   {
//     id: 2,
//     icon: <Play />,
//     message: 'Philips has started a live stream',
//   },

//   {
//     id: 3,
//     icon: <Favorite />,
//     message: "Maaike has liked Leonita's post",
//   },

//   {
//     id: 4,
//     icon: <Chat />,
//     message: "Maaike has commented on Leonita's video",
//   },

//   {
//     id: 5,
//     icon: <Favorite />,
//     message: "Leonita has liked Maaike's video",
//   },

//   {
//     id: 6,
//     icon: <Play />,
//     message: 'Jane has started a live stream',
//   },
//   {
//     id: 7,
//     icon: <Chat />,
//     message: "Maaike has commented on Philips' video",
//   },
//   {
//     id: 8,
//     icon: <Play />,
//     message: 'Philips has started a live stream',
//   },

//   {
//     id: 9,
//     icon: <Favorite />,
//     message: "Maaike has liked Leonita's post",
//   },

//   {
//     id: 10,
//     icon: <Chat />,
//     message: "Maaike has commented on Leonita's video",
//   },

//   {
//     id: 11,
//     icon: <Favorite />,
//     message: "Leonita has liked Maaike's video",
//   },
//   {
//     id: 12,
//     icon: <Favorite />,
//     message: "Maaike has liked Leonita's post",
//   },

//   {
//     id: 13,
//     icon: <Chat />,
//     message: "Maaike has commented on Leonita's video",
//   },

//   {
//     id: 14,
//     icon: <Favorite />,
//     message: "Leonita has liked Maaike's video",
//   },
// ];

const Notifications: FC = () => {
  const [displayCount, setDisplayCount] = useState(SUGGESTION_AMOUNT_LESS);
  const dispatch = useDispatch();
  const {
    activity: { notification },
  } = useSelector((state: AppState) => state);

  const getNotifications = () => {
    dispatch(getNotificationCountAction());
    dispatch(getNotificationsAction(0, 0, 'all'));
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <Box gap="small">
      <Box direction="row" align="center" justify="between">
        <Text size="small" weight="bold">
          Notifications
        </Text>
        {notification.data.length > SUGGESTION_AMOUNT_LESS && (
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
              {displayCount === SUGGESTION_AMOUNT_LESS
                ? 'See more'
                : 'See less'}
            </Text>
          </Button>
        )}
      </Box>
      <Box
        gap="small"
        style={{
          maxHeight: '420px',
          overflowY: 'scroll',
        }}
      >
        {notification.loading || notification.data.length === 0 ? (
          <Text size="small">No notification found</Text>
        ) : (
          notification.data.slice(0, displayCount).map((a) => (
            <Box
              key={a.id}
              direction="row"
              justify="between"
              align="center"
              style={{
                minHeight: '24px',
              }}
            >
              <Box direction="row" align="center" gap="small">
                {a.icon}
                <Text size="xsmall">{a.message}</Text>
              </Box>
            </Box>
          ))
        )}
      </Box>
      {notification.data.length > SUGGESTION_AMOUNT_MORE &&
        displayCount > SUGGESTION_AMOUNT_LESS &&
        displayCount !== notification.data.length && (
          <Button
            alignSelf="end"
            onClick={() => {
              setDisplayCount(notification.data.length);
            }}
          >
            <Text size="small" color="brand">
              See all
            </Text>
          </Button>
        )}
    </Box>
  );
};

export default Notifications;
