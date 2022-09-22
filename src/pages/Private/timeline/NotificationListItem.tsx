import React, { FC, useMemo } from 'react';
import { Box, Text } from 'grommet';
import { Chat, Favorite, TextWrap, User, UserAdd } from 'grommet-icons';
import { NotificationType } from '../../../models/utils';
import { NotificationListItem as NotificationListItemType } from '../../../store/types/activity.types';
import ExtendedBox from '../../../components/utils/ExtendedBox';

interface NotificationListItemProps {
  notification: NotificationListItemType;
}

const NotificationListItem: FC<NotificationListItemProps> = ({
  notification,
}) => {
  const getNotificationPayload = () => {
    switch (notification.type) {
      case NotificationType.POST:
        return {
          icon: <TextWrap />,
          title: `${notification.createdBy.fullName} has started a ${notification.post.title} post..`,
        };
      case NotificationType.POST_LIKE:
        return {
          icon: <Favorite size="18" />,
          title: `${notification.createdBy.fullName} has liked your ${notification.post.title} post.`,
        };
      case NotificationType.POST_COMMENT:
        return {
          icon: <Chat size="18" />,
          title: `${notification.createdBy.fullName} has commented on your ${notification.post.title} post.`,
        };
      case NotificationType.POST_COMMENT_LIKE:
        return {
          icon: <Favorite size="18" />,
          title: `${notification.createdBy.fullName} has liked ${notification.post.title} post comment.`,
        };
      case NotificationType.POST_COMMENT_REPLY:
        return {
          icon: <Chat size="18" />,
          title: `${notification.createdBy.fullName} has replied ${notification.post.title} post comment.`,
        };
      case NotificationType.POST_COMMENT_MENTION:
        return {
          icon: <UserAdd size="18" />,
          title: `${notification.createdBy.fullName} has mentioned ${notification.post.title} post comment.`,
        };
      case NotificationType.CONTACT_REQUEST_ACCEPTED:
        return {
          icon: <User size="18" />,
          title: `${notification.createdBy.fullName} has accepted your contact request.`,
        };
      case NotificationType.CONTACT_REQUEST_RECEIVED:
        return {
          icon: <UserAdd size="18" />,
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
    <ExtendedBox
      direction="row"
      justify="between"
      align="center"
      minHeight="16px"
    >
      <Box direction="row" align="center" gap="small">
        {icon}
        <Text size="xsmall">{title}</Text>
      </Box>
    </ExtendedBox>
  );
};
export default NotificationListItem;
