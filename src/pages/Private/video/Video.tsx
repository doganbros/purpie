import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Text } from 'grommet';
import { Favorite, Chat as ChatIcon } from 'grommet-icons';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import VideoPlayer from '../../../components/utils/video/VideoPlayer';
import { videoPlayerOptions, videoMetadata } from './data/video-data';
import RecommendedVideos from './RecommendedVideos';
import Chat from '../../../components/utils/mattermost/Chat';
import { AppState } from '../../../store/reducers/root.reducer';
import Messages from './Messages';

interface RouteParams {
  id: string;
}

const Video: FC<RouteComponentProps<RouteParams>> = () => {
  const {
    mattermost: { channels },
  } = useSelector((state: AppState) => state);

  const selectedChannel = Object.values(channels).find(
    (channel) => channel.channel.name === 'off-topic'
  )?.channel;

  return (
    <PrivatePageLayout
      title={videoMetadata.name}
      rightComponent={
        selectedChannel ? <Chat channelId={selectedChannel.id} /> : <Messages />
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
                <ChatIcon color="status-disabled" />
                <Text color="status-disabled">{videoMetadata.comments}</Text>
              </Box>
            </Box>
            <Text color="status-disabled">{`${videoMetadata.views.toLocaleString()} views`}</Text>
          </Box>
        </Box>
        <Text color="status-disabled"> {videoMetadata.details} </Text>
        <RecommendedVideos />
      </Box>
    </PrivatePageLayout>
  );
};

export default Video;
