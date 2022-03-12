import React, { FC, useState } from 'react';
import { Box, Button, Spinner, Text } from 'grommet';
import { CaretDownFill, CaretUpFill } from 'grommet-icons';
import { useDispatch } from 'react-redux';
import { listPostCommentRepliesAction } from '../../../../store/actions/post.action';
import { PostCommentState } from '../../../../store/types/post.types';
import CommentBase from './CommentBase';

interface RepliesProps {
  postId: number;
  parentComment: PostCommentState;
}

const Replies: FC<RepliesProps> = ({ parentComment, postId }) => {
  const [showReplies, setShowReplies] = useState(false);
  const dispatch = useDispatch();
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
              ? 'Hide replies'
              : `Show ${parentComment.replyCount} ${
                  parentComment.replyCount === 1 ? 'reply' : 'replies'
                }`}
          </Text>
        </Box>
      </Button>
      {showReplies && parentComment.replies && (
        <Box gap="small">
          {parentComment.replies.loading &&
          !parentComment.replies.data.length ? (
            <Spinner />
          ) : (
            parentComment.replies.data.map((c) => (
              <CommentBase key={c.id} comment={c} postId={postId} />
            ))
          )}
          {parentComment.replies.data.length !== parentComment.replyCount && (
            <Button
              onClick={() => getReplies(parentComment.replies?.data.length)}
            >
              <Text color="brand">Load more</Text>
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Replies;
