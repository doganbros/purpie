import React, { FC, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, InfiniteScroll, ResponsiveContext, Text } from 'grommet';
import PostGridItem from '../../../components/utils/PostGridItem/PostGridItem';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  createPostSaveAction,
  getUserFeedAction,
  removePostSaveAction,
} from '../../../store/actions/post.action';

const RecommendedVideos: FC = () => {
  const size = useContext(ResponsiveContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    post: { feed, postDetail },
  } = useSelector((state: AppState) => state);

  const getFeed = (skip?: number) => {
    dispatch(getUserFeedAction({ skip }));
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <Box gap="small">
      <Text size="large" weight="bold" color="brand">
        Recommended Videos
      </Text>
      <Grid
        columns={size !== 'small' ? 'medium' : '100%'}
        gap={{ row: 'large', column: 'medium' }}
      >
        <InfiniteScroll
          items={feed.data.filter((p) => p.id !== postDetail.data?.id)}
          step={6}
          onMore={() => getFeed(feed.data.length)}
        >
          {(item: typeof feed.data[0]) => (
            <PostGridItem
              key={item.id}
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
