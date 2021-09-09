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
              id={item.id}
              comments={item.comments}
              createdAt={item.createdAt}
              likes={item.likes}
              live={item.live}
              onClickPlay={item.onClickPlay}
              onClickSave={item.onClickSave}
              saved={item.saved}
              tags={item.tags}
              thumbnailSrc={item.thumbnailSrc}
              userAvatarSrc={item.userAvatarSrc}
              userName={item.userName}
              videoTitle={item.videoTitle}
            />
          )}
        </InfiniteScroll>
      </Grid>
    </Box>
  );
};

export default RecommendedVideos;