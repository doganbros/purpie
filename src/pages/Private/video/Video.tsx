import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Box, Text } from 'grommet';
import { Chat, Favorite } from 'grommet-icons';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import VideoPlayer from '../../../components/utils/video/VideoPlayer';
import { videoPlayerOptions, videoMetadata } from './data/video-data';

interface RouteParams {
  id: string;
}

const Video: FC<RouteComponentProps<RouteParams>> = ({
  match: {
    params: { id },
  },
}) => {
  return (
    <PrivatePageLayout title="Watch a video">
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
            <Text color="status-disabled">{`${videoMetadata.views} views`}</Text>
          </Box>
        </Box>
        <Box fill="horizontal" overflow="auto">
          <pre>{JSON.stringify({ id, videoPlayerOptions }, null, 2)}</pre>
        </Box>
      </Box>
    </PrivatePageLayout>
  );
};

export default Video;
