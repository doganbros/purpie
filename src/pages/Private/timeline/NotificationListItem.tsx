import React, { FC, useMemo } from 'react';
import { Anchor, Box, Text } from 'grommet';
import { Chat, Favorite, TextWrap, User, UserAdd } from 'grommet-icons';
import { Trans } from 'react-i18next';
import { NotificationType } from '../../../models/utils';
import { NotificationListItem as NotificationListItemType } from '../../../store/types/activity.types';

interface NotificationListItemProps {
  notification: NotificationListItemType;
}

const NotificationListItem: FC<NotificationListItemProps> = ({
  notification,
}) => {
  const getNotificationPayload = () => {
    const iconColor = notification.viewedOn ? 'black' : 'brand';

    const notificationText = (
      <Trans
        i18nKey={`NotificationListItem.${notification.type.toString()}`}
        components={{
          user: (
            <Anchor
              weight="bold"
              href={`/user/${notification.createdBy.userName}`}
            />
          ),
          post: (
            <Anchor weight="bold" href={`/video/${notification.post.id}`} />
          ),
        }}
        values={{ userName: notification.createdBy.fullName }}
      />
    );
    switch (notification.type) {
      case NotificationType.POST:
        return {
          icon: <TextWrap size="16" color={iconColor} />,
          title: notificationText,
        };
      case NotificationType.POST_LIKE:
        return {
          icon: <Favorite size="16" color={iconColor} />,
          title: notificationText,
        };
      case NotificationType.POST_COMMENT:
        return {
          icon: <Chat size="16" color={iconColor} />,
          title: (
            <Trans
              i18nKey="NotificationListItem.POST_COMMENT"
              components={{
                user: (
                  <Anchor
                    weight="bold"
                    href={`/user/${notification.createdBy.userName}`}
                  />
                ),
                post: (
                  <Anchor
                    weight="bold"
                    href={`/video/${notification.post.id}`}
                  />
                ),
              }}
              values={{ userName: notification.createdBy.fullName }}
            />
          ),
        };
      case NotificationType.POST_COMMENT_LIKE:
        return {
          icon: <Favorite size="16" color={iconColor} />,
          title: (
            <Trans
              i18nKey="NotificationListItem.POST_COMMENT_LIKE"
              components={{
                user: (
                  <Anchor
                    weight="bold"
                    href={`/user/${notification.createdBy.userName}`}
                  />
                ),
                post: (
                  <Anchor
                    weight="bold"
                    href={`/video/${notification.post.id}`}
                  />
                ),
              }}
              values={{ userName: notification.createdBy.fullName }}
            />
          ),
        };
      case NotificationType.POST_COMMENT_REPLY:
        return {
          icon: <Chat size="16" color={iconColor} />,
          title: (
            <Trans
              i18nKey="NotificationListItem.POST_COMMENT_REPLY"
              components={{
                user: (
                  <Anchor
                    weight="bold"
                    href={`/user/${notification.createdBy.userName}`}
                  />
                ),
                post: (
                  <Anchor
                    weight="bold"
                    href={`/video/${notification.post.id}`}
                  />
                ),
              }}
              values={{ userName: notification.createdBy.fullName }}
            />
          ),
        };
      case NotificationType.POST_COMMENT_MENTION:
        return {
          icon: <UserAdd size="16" color={iconColor} />,
          title: (
            <Trans
              i18nKey="NotificationListItem.POST_COMMENT_MENTION"
              components={{
                user: (
                  <Anchor href={`/user/${notification.createdBy.userName}`} />
                ),
                post: <Anchor href={`/video/${notification.post.id}`} />,
              }}
              values={{ userName: notification.createdBy.fullName }}
            />
          ),
        };
      case NotificationType.CONTACT_REQUEST_ACCEPTED:
        return {
          icon: <User size="16" color={iconColor} />,
          title: (
            <Trans
              i18nKey="NotificationListItem.CONTACT_REQUEST_ACCEPTED"
              components={{
                user: (
                  <Anchor href={`/user/${notification.createdBy.userName}`} />
                ),
              }}
              values={{ userName: notification.createdBy.fullName }}
            />
          ),
        };
      case NotificationType.CONTACT_REQUEST_RECEIVED:
        return {
          icon: <UserAdd color={iconColor} size="16" />,
          title: (
            <Trans
              i18nKey="NotificationListItem.CONTACT_REQUEST_ACCEPTED"
              components={{
                user: (
                  <Anchor href={`/user/${notification.createdBy.userName}`} />
                ),
              }}
              values={{ userName: notification.createdBy.fullName }}
            />
          ),
        };
      default:
        return {};
    }
  };
  const { icon, title } = useMemo(() => getNotificationPayload(), [
    notification,
  ]);

  return (
    <Box direction="row" align="center" gap="small">
      {icon}
      <Text
        color={notification.viewedOn ? 'black' : 'brand'}
        weight={notification.viewedOn ? 400 : 500}
        size="xsmall"
      >
        {title}
      </Text>
    </Box>
  );
};
export default NotificationListItem;
