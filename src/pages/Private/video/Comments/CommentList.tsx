import React, { FC, useEffect, useState } from 'react';
import { Box, InfiniteScroll, Select, Stack, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { listPostCommentsAction } from '../../../../store/actions/post.action';
import { AppState } from '../../../../store/reducers/root.reducer';
import CommentBase from './CommentBase';
import Input from './Input';
import Replies from './Replies';
import { UserAvatar } from '../../../../components/utils/Avatars/UserAvatar';
import { useResponsive } from '../../../../hooks/useResponsive';

interface CommentsProps {
  postId: string;
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
  const size = useResponsive();

  const [sortBy, setSortBy] = useState('createdOn');

  const getComments = (skip?: number) => {
    dispatch(listPostCommentsAction({ postId, skip, sortBy }));
  };

  const handleSortChange = ({ value }: { value: string; label: string }) => {
    setSortBy(value);
  };

  useEffect(() => {
    getComments();
  }, [sortBy]);

  return (
    <Box gap="medium">
      <Box direction="row" justify="between" align="center">
        <Text size="large" color="brand" weight="bold">
          {t('CommentList.comments')}
          <Text size="medium" color="status-disabled">{`(${
            comments.data.length +
            comments.data.reduce(
              (total, current) => total + current.replyCount,
              0
            )
          })`}</Text>
        </Text>
        <Select
          value={sortBy}
          onChange={({ option }) => handleSortChange(option)}
          size="small"
          options={[
            { label: 'Newest', value: 'createdOn' },
            { label: 'Most Liked', value: 'likesCount' },
          ]}
          valueKey={{ key: 'value', reduce: true }}
          placeholder="Sort by"
          labelKey="label"
        />
      </Box>

      {user && <Input user={user} postId={postId} />}
      {comments.data.length === 0 ? (
        <Box margin={{ vertical: 'small' }}>
          <Text color="status-disabled">{t('CommentList.noCommentMsg')}</Text>
        </Box>
      ) : (
        <InfiniteScroll items={comments.data}>
          {(item: typeof comments.data[0]) => (
            <Stack key={item.id}>
              <Box
                pad={{ vertical: 'small', right: 'small', left: 'medium' }}
                margin={{ vertical: 'small', left: 'medium' }}
                elevation="peach"
                round="small"
              >
                <Box
                  pad={{ left: size === 'small' ? '36px' : 'small' }}
                  gap="small"
                >
                  <CommentBase hasReply comment={item} postId={postId} />
                  {item.replyCount > 0 && (
                    <Replies parentComment={item} postId={postId} />
                  )}
                </Box>
              </Box>
              <UserAvatar
                hasOnline={false}
                id={item.user.id}
                name={item.user.fullName}
                src={item.user.displayPhoto}
              />
            </Stack>
          )}
        </InfiniteScroll>
      )}
    </Box>
  );
};

export default CommentList;
