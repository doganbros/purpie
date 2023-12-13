import React, { FC, useState } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { Box, Button, DropButton, Text, TextInput } from 'grommet';
import { Favorite, MoreVertical } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import InitialsAvatar from '../../../../components/utils/Avatars/InitialsAvatar';
import ListButton from '../../../../components/utils/ListButton';
import { AppState } from '../../../../store/reducers/root.reducer';
import { PostComment } from '../../../../store/types/post.types';
import {
  createPostCommentAction,
  createPostCommentLikeAction,
  removePostCommentAction,
  removePostCommentLikeAction,
  updatePostCommentAction,
} from '../../../../store/actions/post.action';
import ConfirmDialog from '../../../../components/utils/ConfirmDialog';
import { FavoriteFill } from '../../../../components/utils/CustomIcons';

dayjs.extend(LocalizedFormat);

interface CommentBaseProps {
  comment: PostComment;
  postId: string;
  hasReply?: boolean;
}

const CommentBase: FC<CommentBaseProps> = ({ comment, postId, hasReply }) => {
  const {
    auth: { user },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.comment);

  const isChildComment = !!comment.parentId;

  const handleShowReply = () => {
    setShowReplyInput(true);
    if (isChildComment) {
      setInputValue(`@${comment.user.userName} `);
    }
  };

  const handleReply = () => {
    if (inputValue) {
      dispatch(
        createPostCommentAction(
          inputValue,
          postId,
          comment.parentId || comment.id
        )
      );
      setShowReplyInput(false);
      setInputValue('');
    }
  };

  const handleEdit = () => {
    if (editValue && editValue !== comment.comment) {
      dispatch(
        updatePostCommentAction(
          editValue,
          comment.id,
          comment.parentId || undefined
        )
      );
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
      <Box direction="row" align={isChildComment ? 'center' : 'start'}>
        {isChildComment && (
          <Box pad={{ right: 'xsmall' }}>
            <InitialsAvatar
              id={comment.user.id}
              value={comment.user.fullName}
            />
          </Box>
        )}
        <Box flex="grow">
          <Text weight="bold">{comment.user.fullName}</Text>
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
            {dayjs(comment.createdOn).fromNow()}
          </Text>
          {comment.user.id === user?.id && !isEditing && (
            <DropButton
              plain
              icon={<MoreVertical color="status-disabled-light" />}
              dropContent={
                <>
                  <ListButton
                    label={t('CommentBase.editComment')}
                    onClick={() => setIsEditing(true)}
                  />
                  <ListButton
                    label={t('common.delete')}
                    onClick={() => setShowDeleteDialog(true)}
                  />
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
                  {t('common.cancel')}
                </Text>
              </Button>
              <Button primary onClick={handleEdit} label={t('common.edit')} />
            </Box>
          </Box>
        ) : (
          <Text color="status-disabled">{comment.comment}</Text>
        )}
      </Box>
      <Box direction="row" align="center" gap="medium">
        <Box direction="row" gap="xsmall" align="center">
          <Button
            plain
            onClick={() =>
              comment.liked
                ? dispatch(
                    removePostCommentLikeAction({
                      commentId: comment.id,
                      parentId: comment.parentId || undefined,
                    })
                  )
                : dispatch(
                    createPostCommentLikeAction({
                      postId,
                      commentId: comment.id,
                      parentId: comment.parentId || undefined,
                    })
                  )
            }
            icon={
              comment.liked ? (
                <FavoriteFill size="18px" color="brand" />
              ) : (
                <Favorite size="18px" color="status-disabled" />
              )
            }
          />
          <Text color="status-disabled" size="small">
            {comment.likesCount}
          </Text>
        </Box>

        {hasReply && (
          <Button onClick={handleShowReply}>
            <Text color="status-disabled" size="14px">
              {t('common.reply')}
            </Text>
          </Button>
        )}
      </Box>
      {showReplyInput && user && (
        <Box gap="small">
          <Box direction="row" gap="small">
            <Box flex={{ shrink: 0 }}>
              <InitialsAvatar id={user.id} value={`${user.fullName}`} />
            </Box>
            <Box border={{ color: 'status-disabled', side: 'bottom' }} fill>
              <TextInput
                plain
                autoFocus
                focusIndicator={false}
                placeholder={t('CommentBase.writePublicReply')}
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
                {t('common.cancel')}
              </Text>
            </Button>
            <Button onClick={handleReply} label={t('common.reply')} primary />
          </Box>
        </Box>
      )}
      {showDeleteDialog && (
        <ConfirmDialog
          onConfirm={handleDelete}
          onDismiss={() => setShowDeleteDialog(false)}
          message={t('CommentBase.deleteCommentConfirmMsg')}
          confirmButtonText={t('common.delete')}
        />
      )}
    </Box>
  );
};

export default CommentBase;
