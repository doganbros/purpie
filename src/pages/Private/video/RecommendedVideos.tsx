import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Text } from 'grommet';
import PostGridItem from '../../../components/post/PostGridItem';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  createPostSaveAction,
  getUserFeedAction,
  removePostSaveAction,
} from '../../../store/actions/post.action';
import GradientScroll from '../../../components/utils/GradientScroll';

const RecommendedVideos: FC = () => {
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
  const filteredFeed = feed.data.filter((p) => p.id !== postDetail.data?.id);
  return (
    <Box gap="small">
      <Text size="large" weight="bold" color="brand">
        Recommended Videos
      </Text>
      <GradientScroll>
        <Grid
          columns={{ count: filteredFeed.length, size: 'medium' }}
          gap="small"
        >
          {filteredFeed.map((post: typeof feed.data[0]) => (
            <PostGridItem
              key={post.id}
              post={post}
              onClickPlay={() => history.push(`video/${post.id}`)}
              onClickSave={() => {
                if (post.saved)
                  dispatch(removePostSaveAction({ postId: post.id }));
                else dispatch(createPostSaveAction({ postId: post.id }));
              }}
            />
          ))}
        </Grid>
      </GradientScroll>
    </Box>
  );
};

export default RecommendedVideos;
