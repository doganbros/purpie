import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import { Favorite } from 'grommet-icons';
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

  const getIcon = (type: string): JSX.Element => {
    if (type === 'post_like') {
      return <Favorite />;
    }

    return <></>;
  };

  console.log(notification);
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
                {getIcon(a.type)}
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
