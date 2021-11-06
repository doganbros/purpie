import React, { FC, useEffect } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Box, Layer, Spinner, Text } from 'grommet';
import { Chat as ChatIcon, Favorite } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Chat from '../../../components/mattermost/Chat';
import VideoPlayer from '../../../components/utils/video/VideoPlayer';
import { http } from '../../../config/http';
import { getPostDetailAction } from '../../../store/actions/post.action';
import { AppState } from '../../../store/reducers/root.reducer';

dayjs.extend(relativeTime);
interface RouteParams {
  id: string;
}

const Video: FC = () => {
  const params = useParams<RouteParams>();
  const dispatch = useDispatch();
  const {
    post: {
      postDetail: { data, loading },
    },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    dispatch(getPostDetailAction(+params.id));
  }, []);

  return (
    <PrivatePageLayout
      title={data?.title || 'Loading'}
      rightComponent={!loading && <Chat channelName="off-topic" />}
    >
      {loading || !data ? (
        <Layer responsive={false} plain>
          <Spinner />
        </Layer>
      ) : (
        <Box gap="large" pad={{ vertical: 'medium' }}>
          <Box justify="between" direction="row">
            <Box>
              <Text weight="bold" size="large">
                {data.title}
              </Text>
              <Box direction="row" gap="small">
                {data.tags.map((m) => (
                  <Text key={m.value} color="brand">
                    {`#${m.value}`}
                  </Text>
                ))}
              </Box>
            </Box>
            <Text weight="bold">{dayjs(data.createdOn).fromNow()}</Text>
          </Box>
          <Box gap="medium">
            <VideoPlayer
              options={{
                sources: [
                  {
                    src: `${http.defaults.baseURL}/post/video/view/${data.slug}/${data.videoName}`,
                    type: 'video/mp4',
                  },
                ],
              }}
            />
            <Box direction="row" justify="between">
              <Box direction="row" gap="medium">
                <Box direction="row" gap="xsmall">
                  <Favorite color="status-disabled" />
                  <Text color="status-disabled">{data.likesCount}</Text>
                </Box>
                <Box direction="row" gap="xsmall">
                  <ChatIcon color="status-disabled" />
                  <Text color="status-disabled">{data.commentsCount}</Text>
                </Box>
              </Box>
              <Text color="status-disabled">VIEW_COUNT_MISSING</Text>
            </Box>
          </Box>
          <Text color="status-disabled"> {data.description} </Text>
          {/* <RecommendedVideos /> */}
        </Box>
      )}
    </PrivatePageLayout>
  );
};

export default Video;
