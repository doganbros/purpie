import React, { FC, useEffect, useState } from 'react';
import { Box, Button, InfiniteScroll, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import {
  INVITATION_AMOUNT_LESS,
  INVITATION_AMOUNT_MORE,
} from '../../../helpers/constants';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  getNotificationCountAction,
  getNotificationsAction,
  viewNotificationsAction,
} from '../../../store/actions/activity.action';
import NotificationListItem from './NotificationListItem';

const Notifications: FC = () => {
  const [displayCount, setDisplayCount] = useState(INVITATION_AMOUNT_LESS);
  const dispatch = useDispatch();
  const {
    activity: { notification },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    getNotifications();

    return () => {
      const data =
        displayCount === INVITATION_AMOUNT_LESS
          ? notification.data.slice(0, displayCount).filter((d) => !d.viewedOn)
          : notification.data.filter((d) => !d.viewedOn);

      if (data.length) dispatch(viewNotificationsAction(data.map((d) => d.id)));
    };
  }, []);

  const getNotifications = (skip?: number) => {
    dispatch(getNotificationCountAction());
    dispatch(getNotificationsAction(INVITATION_AMOUNT_MORE, skip, 'all'));
  };

  const data =
    displayCount === INVITATION_AMOUNT_LESS
      ? notification.data.slice(0, displayCount)
      : notification.data;

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
      {notification.loading && data.length === 0 && (
        <Text size="small">Loading</Text>
      )}
      {!notification.loading && data.length === 0 && (
        <Text size="small" color="brand" weight={500}>
          No notifications found
        </Text>
      )}
      <Box overflow="auto" height={{ max: '472px' }}>
        <InfiniteScroll
          step={6}
          items={data}
          onMore={() => {
            getNotifications(notification.data.length);
          }}
        >
          {(item: typeof notification.data[0]) => (
            <Box height={{ min: '24px' }} gap="small" key={item.id}>
              <NotificationListItem notification={item} />
            </Box>
          )}
        </InfiniteScroll>
      </Box>
    </Box>
  );
};

export default Notifications;
