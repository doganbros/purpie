import React, { FC, useEffect } from 'react';
import { Box, InfiniteScroll, Stack, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import InitialsAvatar from '../../../../components/utils/InitialsAvatar';
import { listPostCommentsAction } from '../../../../store/actions/post.action';
import { AppState } from '../../../../store/reducers/root.reducer';
import CommentBase from './CommentBase';
import Input from './Input';
import Replies from './Replies';

interface CommentsProps {
  postId: number;
}

const CommentList: FC<CommentsProps> = ({ postId }) => {
  const {
    auth: { user },
    post: {
      postDetail: { comments },
    },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const getComments = (skip?: number) => {
    dispatch(listPostCommentsAction({ postId, skip }));
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <Box gap="medium">
      <Text size="large" color="brand" weight="bold">
        {t('comments')}
      </Text>
      {user && <Input user={user} postId={postId} />}
      {comments.data.length === 0 ? (
        <Box margin={{ vertical: 'small' }}>
          <Text color="status-disabled">{t('CommentList.noCommentMsg')}</Text>
        </Box>
      ) : (
        <InfiniteScroll items={comments.data}>
          {(item: typeof comments.data[0]) => (
            <Stack key={item.id} interactiveChild="first">
              <Box
                pad={{ vertical: 'small', right: 'small', left: 'medium' }}
                margin={{ vertical: 'small', left: 'medium' }}
                elevation="peach"
                round="small"
              >
                <Box pad={{ left: 'small' }} gap="small">
                  <CommentBase comment={item} postId={postId} />
                  {item.replyCount > 0 && (
                    <Replies parentComment={item} postId={postId} />
                  )}
                </Box>
              </Box>
              <InitialsAvatar id={item.user.id} value={item.user.fullName} />
            </Stack>
          )}
        </InfiniteScroll>
      )}
    </Box>
  );
};

export default CommentList;
