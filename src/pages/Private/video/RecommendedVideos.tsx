import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Text } from 'grommet';
import { useTranslation } from 'react-i18next';
import PostGridItem from '../../../components/post/PostGridItem';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  createPostSaveAction,
  getFeedListAction,
  removePostSaveAction,
} from '../../../store/actions/post.action';
import GradientScroll from '../../../components/utils/GradientScroll';

const RecommendedVideos: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    post: { feed, postDetail },
  } = useSelector((state: AppState) => state);

  const getFeed = (skip?: number) => {
    dispatch(getFeedListAction({ skip }));
  };

  useEffect(() => {
    getFeed();
  }, []);
  const filteredFeed = feed.data.filter((p) => p.id !== postDetail.data?.id);
  return (
    <Box gap="small">
      <Text size="large" weight="bold" color="brand">
        {t('RecommendedVideos.title')}
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
              onClickPlay={() => history.push(`${post.id}`)}
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
