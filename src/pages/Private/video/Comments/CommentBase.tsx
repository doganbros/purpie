import React, { FC, useState } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Box, Button, DropButton, Text, TextInput } from 'grommet';
import { Like, MoreVertical } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import InitialsAvatar from '../../../../components/utils/InitialsAvatar';
import ListButton from '../../../../components/utils/ListButton';
import { AppState } from '../../../../store/reducers/root.reducer';
import { PostComment } from '../../../../store/types/post.types';
import {
  createPostCommentAction,
  removePostCommentAction,
  updatePostCommentAction,
} from '../../../../store/actions/post.action';
import ConfirmDialog from '../../../../components/utils/ConfirmDialog';

dayjs.extend(LocalizedFormat);

interface CommentBaseProps {
  comment: PostComment;
  showAvatar?: boolean;
  showReply?: boolean;
  postId: number;
}

const CommentBase: FC<CommentBaseProps> = ({
  comment,
  showAvatar,
  showReply,
  postId,
}) => {
  const {
    auth: { user },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.comment);

  const handleReply = () => {
    if (inputValue) {
      dispatch(createPostCommentAction(inputValue, postId, comment.id));
      setShowReplyInput(false);
      setInputValue('');
    }
  };

  const handleEdit = () => {
    if (editValue && editValue !== comment.comment) {
      dispatch(updatePostCommentAction(editValue, comment.id));
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    dispatch(
      removePostCommentAction(comment.id, comment.parentId || undefined)
    );
  };

  return (
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
          {comment.user.id === user?.id && !isEditing && (
            <DropButton
              plain
              icon={<MoreVertical color="status-disabled-light" />}
              dropContent={
                <>
                  <ListButton onClick={() => setIsEditing(true)}>
                    <Text>Edit Comment</Text>
                  </ListButton>
                  <ListButton onClick={() => setShowDeleteDialog(true)}>
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
        {isEditing ? (
          <Box gap="small">
            <Box border={{ color: 'status-disabled', side: 'bottom' }} fill>
              <TextInput
                plain
                autoFocus
                focusIndicator={false}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            </Box>
            <Box direction="row" justify="end" gap="small">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setEditValue(comment.comment);
                }}
              >
                <Text color="status-disabled" weight="bold">
                  Cancel
                </Text>
              </Button>
              <Button primary onClick={handleEdit} label="Edit" />
            </Box>
          </Box>
        ) : (
          <Text color="status-disabled">{comment.comment}</Text>
        )}
      </Box>
      <Box direction="row" align="center" gap="medium">
        <Button>
          <Like color="status-disabled" size="14px" />
        </Button>
        {showReply && (
          <Button onClick={() => setShowReplyInput(true)}>
            <Text color="status-disabled" size="14px">
              REPLY
            </Text>
          </Button>
        )}
      </Box>
      {showReplyInput && user && (
        <Box gap="small">
          <Box direction="row" gap="small">
            <Box flex={{ shrink: 0 }}>
              <InitialsAvatar
                id={user.id}
                value={`${user.firstName} ${user.lastName}`}
              />
            </Box>
            <Box border={{ color: 'status-disabled', side: 'bottom' }} fill>
              <TextInput
                plain
                focusIndicator={false}
                placeholder="Write a public reply"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </Box>
          </Box>
          <Box alignSelf="end" direction="row" gap="small">
            <Button
              onClick={() => {
                setShowReplyInput(false);
                setInputValue('');
              }}
            >
              <Text color="status-disabled" weight="bold">
                Cancel
              </Text>
            </Button>
            <Button onClick={handleReply} label="Reply" primary />
          </Box>
        </Box>
      )}
      {showDeleteDialog && (
        <ConfirmDialog
          onConfirm={handleDelete}
          onDismiss={() => setShowDeleteDialog(false)}
          message="Are you sure you want to delete the comment?"
          confirmButtonText="Delete"
        />
      )}
    </Box>
  );
};

export default CommentBase;