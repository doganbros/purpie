import React, { FC, useMemo } from 'react';
import { Box, Text } from 'grommet';
import { Chat, Favorite, TextWrap, User, UserAdd } from 'grommet-icons';
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

    switch (notification.type) {
      case NotificationType.POST:
        return {
          icon: <TextWrap size="16" color={iconColor} />,
          title: `${notification.createdBy.fullName} has started a ${notification.post.title} post..`,
        };
      case NotificationType.POST_LIKE:
        return {
          icon: <Favorite size="16" color={iconColor} />,
          title: `${notification.createdBy.fullName} has liked your ${notification.post.title} post.`,
        };
      case NotificationType.POST_COMMENT:
        return {
          icon: <Chat size="16" color={iconColor} />,
          title: `${notification.createdBy.fullName} has commented on your ${notification.post.title} post.`,
        };
      case NotificationType.POST_COMMENT_LIKE:
        return {
          icon: <Favorite size="16" color={iconColor} />,
          title: `${notification.createdBy.fullName} has liked ${notification.post.title} post comment.`,
        };
      case NotificationType.POST_COMMENT_REPLY:
        return {
          icon: <Chat size="16" color={iconColor} />,
          title: `${notification.createdBy.fullName} has replied ${notification.post.title} post comment.`,
        };
      case NotificationType.POST_COMMENT_MENTION:
        return {
          icon: <UserAdd size="16" color={iconColor} />,
          title: `${notification.createdBy.fullName} has mentioned ${notification.post.title} post comment.`,
        };
      case NotificationType.CONTACT_REQUEST_ACCEPTED:
        return {
          icon: <User size="16" color={iconColor} />,
          title: `${notification.createdBy.fullName} has accepted your contact request.`,
        };
      case NotificationType.CONTACT_REQUEST_RECEIVED:
        return {
          icon: <UserAdd color={iconColor} size="16" />,
          title: `${notification.createdBy.fullName} has want to add you as a contact.`,
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
        weight={notification.viewedOn ? 400 : 600}
        size="xsmall"
      >
        {title}
      </Text>
    </Box>
  );
};
export default NotificationListItem;
