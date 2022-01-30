import { Grid, InfiniteScroll } from 'grommet';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PostGridItem from '../../../components/utils/PostGridItem/PostGridItem';
import { useResponsive } from '../../../hooks/useResponsive';
import { saveSearchedPostAction } from '../../../store/actions/search.action';
import { Post } from '../../../store/types/post.types';

interface PostResultsProps {
  posts: Post[];
  onMore: () => any;
}
const PostResults: FC<PostResultsProps> = ({ posts, onMore }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const size = useResponsive();

  return (
    <Grid columns={size !== 'small' ? 'medium' : '100%'}>
      <InfiniteScroll step={6} items={posts} onMore={onMore}>
        {(item: Post) => (
          <PostGridItem
            post={item}
            onClickPlay={() => history.push(`video/${item.id}`)}
            onClickSave={() => {
              if (!item.saved) dispatch(saveSearchedPostAction(item.id));
            }}
          />
        )}
      </InfiniteScroll>
    </Grid>
  );
};

export default PostResults;
