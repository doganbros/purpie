import React, { FC, useEffect } from 'react';
import { Box, Layer, Spinner, Text } from 'grommet';
import { Chat as ChatIcon, Favorite } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Chat from '../../../components/mattermost/Chat';
import VideoPlayer from '../../../components/utils/video/VideoPlayer';
import { http } from '../../../config/http';
import { getVideoDetailAction } from '../../../store/actions/video.action';
import { AppState } from '../../../store/reducers/root.reducer';
import RecommendedVideos from './RecommendedVideos';

interface RouteParams {
  id: string;
}

const Video: FC = () => {
  const params = useParams<RouteParams>();
  const dispatch = useDispatch();
  const {
    video: { loading, videoDetails },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    dispatch(getVideoDetailAction(+params.id));
  }, []);

  const src = http.defaults.baseURL
    ?.concat('/video/view/')
    .concat(videoDetails.slug);

  return (
    <PrivatePageLayout
      title="TITLE_MISSING"
      rightComponent={!loading && <Chat channelName="off-topic" />}
    >
      {loading ? (
        <Layer responsive={false} plain>
          <Spinner />
        </Layer>
      ) : (
        <Box gap="large" pad={{ vertical: 'medium' }}>
          <Box justify="between" direction="row">
            <Box>
              <Text weight="bold" size="large">
                TITLE_MISSING
              </Text>
              <Box direction="row" gap="small">
                {videoDetails.tags.map((m) => (
                  <Text key={m.value} color="brand">
                    {`#${m.value}`}
                  </Text>
                ))}
              </Box>
            </Box>
            {/* <Text weight="bold">{dayjs(videoDetails.created)}</Text> */}
            <Text weight="bold">DATE_MISSING</Text>
          </Box>
          <Box gap="medium">
            <VideoPlayer
              options={
                src
                  ? {
                      sources: [
                        {
                          src,
                          type: 'video/mp4',
                        },
                      ],
                    }
                  : {}
              }
            />
            <Box direction="row" justify="between">
              <Box direction="row" gap="medium">
                <Box direction="row" gap="xsmall">
                  <Favorite color="status-disabled" />
                  <Text color="status-disabled">LIKES_COUNT_MISSING</Text>
                </Box>
                <Box direction="row" gap="xsmall">
                  <ChatIcon color="status-disabled" />
                  <Text color="status-disabled">COMMENTS_COUNT_MISSING</Text>
                </Box>
              </Box>
              <Text color="status-disabled">VIEW_COUNT_MISSING</Text>
            </Box>
          </Box>
          <Text color="status-disabled"> {videoDetails.description} </Text>
          <RecommendedVideos />
        </Box>
      )}
    </PrivatePageLayout>
  );
};

export default Video;
