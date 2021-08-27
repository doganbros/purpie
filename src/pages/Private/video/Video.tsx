import React, { FC, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Box, Grid, InfiniteScroll, Text, ResponsiveContext } from 'grommet';
import { Chat, Favorite } from 'grommet-icons';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import VideoPlayer from '../../../components/utils/video/VideoPlayer';
import VideoGridItem from '../../../components/utils/VideoGridItem';
import MessageItem from '../../../components/utils/MessageItem';
import { videoPlayerOptions, videoMetadata } from './data/video-data';
import { recommendedVideos } from './data/recommended-videos';
import { messages } from './data/messages';

interface RouteParams {
  id: string;
}

const Video: FC<RouteComponentProps<RouteParams>> = ({
  match: {
    params: { id },
  },
}) => {
  const size = useContext(ResponsiveContext);
  // eslint-disable-next-line no-console
  console.log(id);
  return (
    <PrivatePageLayout
      title={videoMetadata.name}
      rightComponent={
        <Box pad={{ vertical: 'large', horizontal: 'medium' }} gap="large">
          {messages.map(({ avatarSrc, id: messageId, message, name, side }) => (
            <MessageItem
              key={messageId}
              avatarSrc={avatarSrc}
              message={message}
              name={name}
              side={side}
            />
          ))}
        </Box>
      }
    >
      <Box gap="large" pad={{ vertical: 'medium' }}>
        <Box justify="between" direction="row">
          <Box>
            <Text weight="bold" size="large">
              {videoMetadata.name}
            </Text>
            <Box direction="row" gap="small">
              {videoMetadata.tags.map((m) => (
                <Text key={m.id} color="brand">
                  {m.name}
                </Text>
              ))}
            </Box>
          </Box>
          <Text weight="bold">{videoMetadata.date}</Text>
        </Box>
        <Box gap="medium">
          <VideoPlayer options={videoPlayerOptions} />
          <Box direction="row" justify="between">
            <Box direction="row" gap="medium">
              <Box direction="row" gap="xsmall">
                <Favorite color="status-disabled" />
                <Text color="status-disabled">{videoMetadata.likes}</Text>
              </Box>
              <Box direction="row" gap="xsmall">
                <Chat color="status-disabled" />
                <Text color="status-disabled">{videoMetadata.comments}</Text>
              </Box>
            </Box>
            <Text color="status-disabled">{`${videoMetadata.views.toLocaleString()} views`}</Text>
          </Box>
        </Box>
        <Text color="status-disabled"> {videoMetadata.details} </Text>
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
      </Box>
    </PrivatePageLayout>
  );
};

export default Video;
