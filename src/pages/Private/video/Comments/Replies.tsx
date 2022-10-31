import React, { FC, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import { CaretDownFill, CaretUpFill } from 'grommet-icons';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { listPostCommentRepliesAction } from '../../../../store/actions/post.action';
import { PostCommentState } from '../../../../store/types/post.types';
import CommentBase from './CommentBase';
import PurpieLogoAnimated from '../../../../assets/purpie-logo/purpie-logo-animated';

interface RepliesProps {
  postId: number;
  parentComment: PostCommentState;
}

const Replies: FC<RepliesProps> = ({ parentComment, postId }) => {
  const [showReplies, setShowReplies] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const getReplies = (skip?: number) => {
    dispatch(
      listPostCommentRepliesAction({ postId, parentId: parentComment.id, skip })
    );
  };
  const handleToggleButton = () => {
    if (!showReplies) {
      getReplies();
      setShowReplies(!showReplies);
      return;
    }
    setShowReplies(false);
  };
  return (
    <Box gap="small">
      <Button onClick={handleToggleButton}>
        <Box direction="row" align="center">
          {showReplies ? (
            <CaretUpFill color="brand" />
          ) : (
            <CaretDownFill color="brand" />
          )}
          <Text size="small" weight="bold" color="brand">
            {showReplies
              ? t('Replies.hideReplies')
              : t('Replies.showReplies', {
                  count: parentComment.replyCount,
                  reply: t(
                    `Replies.${
                      parentComment.replyCount === 1 ? 'reply' : 'replies'
                    }`
                  ),
                })}
          </Text>
        </Box>
      </Button>
      {showReplies && parentComment.replies && (
        <Box gap="small">
          {parentComment.replies.loading &&
          !parentComment.replies.data.length ? (
            <PurpieLogoAnimated width={50} height={50} color="#956aea" />
          ) : (
            parentComment.replies.data.map((c) => (
              <CommentBase key={c.id} comment={c} postId={postId} />
            ))
          )}
          {parentComment.replies.data.length !== parentComment.replyCount && (
            <Button
              onClick={() => getReplies(parentComment.replies?.data.length)}
            >
              <Text color="brand">{t('Replies.loadMore')}</Text>
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Replies;
