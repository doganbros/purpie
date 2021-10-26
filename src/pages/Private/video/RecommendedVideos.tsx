import React, { FC, useContext } from 'react';
import { Box, Grid, InfiniteScroll, ResponsiveContext, Text } from 'grommet';
import { recommendedVideos } from './data/recommended-videos';
import VideoGridItem from '../../../components/utils/VideoGridItem';

const RecommendedVideos: FC = () => {
  const size = useContext(ResponsiveContext);
  return (
    <Box gap="small">
      <Text size="large" weight="bold" color="brand">
        Recommended Videos
      </Text>
      <Grid
        columns={size !== 'small' ? 'medium' : '100%'}
        gap={{ row: 'large', column: 'medium' }}
      >
        <InfiniteScroll items={recommendedVideos} step={6}>
          {(item: typeof recommendedVideos[0]) => (
            <VideoGridItem
              key={item.id}
              id={+item.id}
              slug={item.id.toString()}
              comments={item.comments.toString()}
              createdAt={item.createdAt}
              likes={item.likes.toString()}
              live={item.live}
              onClickPlay={item.onClickPlay}
              onClickSave={item.onClickSave}
              saved={item.saved}
              tags={item.tags}
              userAvatarSrc={item.userAvatarSrc}
              createdBy={item.createdBy}
              videoTitle={item.videoTitle}
              videoName={item.id}
            />
          )}
        </InfiniteScroll>
      </Grid>
    </Box>
  );
};

export default RecommendedVideos;
