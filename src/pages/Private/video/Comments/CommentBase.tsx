import React, { FC } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Box, DropButton, Text } from 'grommet';
import { MoreVertical } from 'grommet-icons';
import ListButton from '../../../../components/utils/ListButton';
import { PostComment } from '../../../../store/types/post.types';
import InitialsAvatar from '../../../../components/utils/InitialsAvatar';

dayjs.extend(LocalizedFormat);

interface CommentBaseProps {
  comment: PostComment;
  showActions?: boolean;
  showAvatar?: boolean;
}

const CommentBase: FC<CommentBaseProps> = ({
  comment,
  showActions,
  showAvatar,
}) => (
  <Box gap="small">
    <Box direction="row" align={showAvatar ? 'center' : 'start'}>
      {showAvatar && (
        <Box pad={{ right: 'xsmall' }}>
          <InitialsAvatar
            id={comment.user.id}
            value={`${comment.user.firstName} ${comment.user.lastName}`}
          />
        </Box>
      )}
      <Box flex="grow">
        <Text weight="bold">{`${comment.user.firstName} ${comment.user.lastName}`}</Text>
      </Box>
      <Box direction="row" align="start">
        {comment.edited && (
          <Text
            size="small"
            color="status-disabled"
            margin={{ right: 'xsmall' }}
          >
            (edited)
          </Text>
        )}
        <Text size="small" color="status-disabled">
          {dayjs(comment.createdOn).format('L')}
        </Text>
        {showActions && (
          <DropButton
            plain
            icon={<MoreVertical color="status-disabled-light" />}
            dropContent={
              <>
                <ListButton>
                  <Text>Edit Comment</Text>
                </ListButton>
                <ListButton>
                  <Text>Delete</Text>
                </ListButton>
              </>
            }
            dropAlign={{ top: 'bottom', right: 'right' }}
          />
        )}
      </Box>
    </Box>
    <Box flex="grow">
      <Text color="status-disabled">{comment.comment}</Text>
    </Box>
  </Box>
);

export default CommentBase;
