import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import {
  INVITATION_AMOUNT_LESS,
  INVITATION_AMOUNT_MORE,
} from '../../../helpers/constants';
import {
  getNotificationCountAction,
  getNotificationsAction,
} from '../../../store/actions/activity.action';
import { AppState } from '../../../store/reducers/root.reducer';
import NotificationListItem from './NotificationListItem';

const Notifications: FC = () => {
  const [displayCount, setDisplayCount] = useState(INVITATION_AMOUNT_LESS);
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
        {notification.data.length > INVITATION_AMOUNT_LESS && (
          <Button
            onClick={() => {
              setDisplayCount((dc) =>
                dc === INVITATION_AMOUNT_LESS
                  ? INVITATION_AMOUNT_MORE
                  : INVITATION_AMOUNT_LESS
              );
            }}
          >
            <Text size="small" color="brand">
              {displayCount === INVITATION_AMOUNT_LESS
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
          notification.data
            .slice(0, displayCount)
            .map((item) => (
              <NotificationListItem key={item.id} notification={item} />
            ))
        )}
      </Box>
      {notification.data.length > INVITATION_AMOUNT_MORE &&
        displayCount > INVITATION_AMOUNT_LESS &&
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
