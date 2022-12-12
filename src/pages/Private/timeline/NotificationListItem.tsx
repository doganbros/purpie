import React, { FC, useMemo } from 'react';
import { Anchor, Box, Text } from 'grommet';
import { Chat, Favorite, TextWrap, User, UserAdd } from 'grommet-icons';
import { Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { NotificationType } from '../../../models/utils';
import { NotificationListItem as NotificationListItemType } from '../../../store/types/activity.types';
import { readNotificationsAction } from '../../../store/actions/activity.action';

interface NotificationListItemProps {
  notification: NotificationListItemType;
}

const NotificationListItem: FC<NotificationListItemProps> = ({
  notification,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const navigateContent = (path: string) => {
    if (!notification.readOn) {
      dispatch(readNotificationsAction(notification.id));
    }
    history.push(path);
  };

  const getNotificationPayload = () => {
    const iconColor = notification.viewedOn ? 'black' : 'brand';

    const title = (
      <Trans
        i18nKey={`NotificationListItem.${notification.type.toString()}`}
        components={{
          user: (
            <Anchor
              weight="600"
              onClick={() =>
                navigateContent(`/user/${notification.createdBy.userName}`)
              }
            />
          ),
          post: (
            <Anchor
              weight="600"
              onClick={() => navigateContent(`/video/${notification.post.id}`)}
            />
          ),
        }}
        values={{ userName: notification.createdBy.fullName }}
      />
    );

    const iconProps = { size: '16', color: iconColor };
    let icon;
    switch (notification.type) {
      case NotificationType.POST:
        icon = <TextWrap {...iconProps} />;
        break;
      case NotificationType.POST_LIKE:
      case NotificationType.POST_COMMENT_LIKE:
        icon = <Favorite {...iconProps} />;
        break;
      case NotificationType.POST_COMMENT:
      case NotificationType.POST_COMMENT_REPLY:
        icon = <Chat {...iconProps} />;
        break;
      case NotificationType.POST_COMMENT_MENTION:
      case NotificationType.CONTACT_REQUEST_RECEIVED:
        icon = <UserAdd {...iconProps} />;
        break;
      case NotificationType.CONTACT_REQUEST_ACCEPTED:
        icon = <User {...iconProps} />;
        break;
      default:
        break;
    }

    return { icon, title };
  };

  const { icon, title } = useMemo(() => getNotificationPayload(), [
    notification,
  ]);

  return (
    <Box direction="row" align="center" gap="small">
      {icon}
      <Text
        color={notification.viewedOn ? 'black' : 'brand'}
        weight={500}
        size="xsmall"
      >
        {title}
      </Text>
    </Box>
  );
};
export default NotificationListItem;
