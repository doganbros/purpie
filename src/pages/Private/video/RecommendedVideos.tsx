import React, { FC, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, InfiniteScroll, ResponsiveContext, Text } from 'grommet';
import PostGridItem from '../../../components/utils/PostGridItem/PostGridItem';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  createPostSaveAction,
  removePostSaveAction,
} from '../../../store/actions/post.action';

const RecommendedVideos: FC = () => {
  const size = useContext(ResponsiveContext);
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    post: { feed },
  } = useSelector((state: AppState) => state);
  return (
    <Box gap="small">
      <Text size="large" weight="bold" color="brand">
        Recommended Videos
      </Text>
      <Grid
        columns={size !== 'small' ? 'medium' : '100%'}
        gap={{ row: 'large', column: 'medium' }}
      >
        <InfiniteScroll items={feed.data} step={6}>
          {(item: typeof feed.data[0]) => (
            <PostGridItem
              post={item}
              onClickPlay={() => history.push(`video/${item.id}`)}
              onClickSave={() => {
                if (item.saved)
                  dispatch(removePostSaveAction({ postId: item.id }));
                else dispatch(createPostSaveAction({ postId: item.id }));
              }}
            />
          )}
        </InfiniteScroll>
      </Grid>
    </Box>
  );
};

export default RecommendedVideos;
