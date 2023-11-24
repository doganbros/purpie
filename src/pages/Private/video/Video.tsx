import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import videojs from 'video.js';
import { Box, Button, Layer, Text } from 'grommet';
import { AddCircle, Dislike, Favorite, SettingsOption } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import {
  createPostLikeAction,
  getPostDetailAction,
  removePostAction,
  removePostLikeAction,
} from '../../../store/actions/post.action';
import { AppState } from '../../../store/reducers/root.reducer';
import RecommendedVideos from './RecommendedVideos';
import VideoJs from '../../../components/post/VideoJs';
import { http } from '../../../config/http';
import { postViewStats } from '../../../store/services/post.service';
import CommentList from './Comments/CommentList';
import Chat from '../../../components/chat/Chat';
import { socket } from '../../../helpers/socket';
import VideoSettings from './VideoSettings';
import ConfirmDialog from '../../../components/utils/ConfirmDialog';
import ChannelBadge from '../../../components/utils/channel/ChannelBadge';
import ZoneBadge from '../../../components/utils/zone/ZoneBadge';
import UserBadge from '../../../components/utils/UserBadge';
import Highlight from '../../../components/utils/Highlight';
import { setSelectedChannelAction } from '../../../store/actions/channel.action';
import { matchDescriptionTags } from '../../../helpers/utils';
import PurpieLogoAnimated from '../../../assets/purpie-logo/purpie-logo-animated';
import { DELAY_TIME } from '../../../helpers/constants';
import useDelayTime from '../../../hooks/useDelayTime';
import { AddToFolderDrop } from '../../../layers/saved-video/folder/AddToFolderDrop';
import { useResponsive } from '../../../hooks/useResponsive';
import ShareVideo from './ShareVideo';
import { FavoriteFill } from '../../../components/utils/CustomIcons';

interface RouteParams {
  id: string;
}

const { REACT_APP_STREAMING_URL } = process.env;

const Video: FC = () => {
  const DECISECOND = 10;
  const params = useParams<RouteParams>();
  const { t } = useTranslation();
  const [liveStreamCount, setLiveStreamCount] = useState(0);
  const dispatch = useDispatch();
  const {
    channel: { userChannels },
    post: {
      postDetail: { data, loading },
    },
    auth: { user },
  } = useSelector((state: AppState) => state);

  const history = useHistory();
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const previousTime = useRef(0);
  const currentTime = useRef(0);
  const startedFrom = useRef(0);
  const userChannelsFiltered = userChannels.data.filter(
    (c) => c.channel.id === data?.channel?.id
  )[0];

  const size = useResponsive();

  const player = useRef<videojs.Player | null>(null);

  const { delay } = useDelayTime(DELAY_TIME);

  const maybeSendViewStat = () => {
    if (previousTime.current > startedFrom.current) {
      postViewStats(
        params.id,
        startedFrom.current * DECISECOND,
        (player.current?.ended()
          ? player.current.duration()
          : previousTime.current) * DECISECOND
      );
    }
  };

  const onReady = () => {
    player.current?.on('timeupdate', () => {
      previousTime.current = currentTime.current;
      currentTime.current = player.current!.currentTime();
    });

    player.current?.on('seeking', () => {
      maybeSendViewStat();
      startedFrom.current = currentTime.current;
    });

    player.current?.on('ended', () => {
      maybeSendViewStat();
      startedFrom.current = 0;
      previousTime.current = 0;
      currentTime.current = 0;
    });

    player.current?.on('firstplay', () => {
      postViewStats(params.id, 0, 0);
    });
  };

  const chatComponent = useMemo(
    () =>
      data ? (
        <Chat medium="post" id={params.id} handleTypingEvent canAddFile />
      ) : null,
    [data, params.id]
  );

  const renderVideoSettingsResponsive = () => {
    if (size === 'small' && showSettings) {
      return (
        <Layer>
          <VideoSettings
            setShowSettings={setShowSettings}
            setShowDeleteConfirmation={setShowDeleteConfirmation}
          />
        </Layer>
      );
    }
    return true;
  };

  const renderChatResponsive = () => {
    if (size === 'small') {
      return (
        <Box
          width={{ max: '100%' }}
          height="500px"
          background="white"
          round="large"
          pad={{ bottom: 'medium' }}
          elevation="indigo"
        >
          {chatComponent}
        </Box>
      );
    }
    return true;
  };

  const handleSelectChannel = () => {
    if (data?.channel) {
      dispatch(setSelectedChannelAction(userChannelsFiltered.channel.id));
    }
  };

  useEffect(() => {
    dispatch(getPostDetailAction(params.id));
  }, [params.id]);

  useEffect(() => {
    if (data) setLiveStreamCount(data.postReaction.liveStreamViewersCount);
  }, [data]);

  useEffect(() => {
    if (data && params.id === data.id && data.streaming) {
      const handleCountChange = ({
        counter,
        postId,
      }: {
        counter: number;
        postId: string;
      }) => {
        if (postId === data.id) setLiveStreamCount(counter);
      };

      socket.on('stream_viewer_count_change', handleCountChange);

      return () => {
        socket.off('stream_viewer_count_change', handleCountChange);
      };
    }
    return undefined;
  }, [data, params.id]);

  useEffect(() => {
    const onUnload = () => {
      maybeSendViewStat();
      if (data?.streaming) socket.emit('leave_post', +params.id);
    };
    window.addEventListener('beforeunload', onUnload);

    return () => {
      window.removeEventListener('beforeunload', onUnload);
      onUnload();
    };
  }, []);

  return (
    <PrivatePageLayout
      rightComponentWithoutOverflow={!showSettings}
      title={data?.title || t('common.loading')}
      rightComponent={
        showSettings ? (
          <VideoSettings
            setShowSettings={setShowSettings}
            setShowDeleteConfirmation={setShowDeleteConfirmation}
          />
        ) : (
          chatComponent
        )
      }
    >
      {renderVideoSettingsResponsive()}
      {delay || loading || !data ? (
        <Box height="100vh" justify="center" align="center">
          <PurpieLogoAnimated width={100} height={100} color="#9060EB" />
        </Box>
      ) : (
        <Box
          gap="large"
          pad={{ vertical: 'medium' }}
          width={{ max: '1620px' }}
          alignSelf="center"
          fill
        >
          <Box>
            <Box justify="between" direction="row">
              <Box>
                <Text weight="bold" size="large">
                  {data.title}
                </Text>
              </Box>
              <Text weight="bold">{dayjs(data.createdOn).fromNow()}</Text>
            </Box>
            <Box justify="between" align="center" direction="row">
              {(data?.type === 'video' && (
                <Box direction="row" align="center" gap="medium">
                  {data?.channel?.zone && (
                    <ZoneBadge
                      name={data.channel.zone.name}
                      subdomain={data.channel.zone.subdomain}
                    />
                  )}
                  {data?.channel?.name && (
                    <Box onClick={handleSelectChannel}>
                      <ChannelBadge name={data.channel.name} url="/" />
                    </Box>
                  )}

                  <UserBadge
                    url={`/user/${data?.createdBy?.userName}`}
                    fullName={data?.createdBy?.fullName}
                  />
                </Box>
              )) || <Box />}
              {data?.createdBy?.id === user?.id && (
                <Box
                  onClick={() => setShowSettings((previous) => !previous)}
                  focusIndicator={false}
                  pad={{ vertical: 'small' }}
                >
                  <SettingsOption size="medium" color="brand" />
                </Box>
              )}
            </Box>
            <Box
              margin={{ top: 'small' }}
              gap="medium"
              width={{ max: '1620px' }}
            >
              <VideoJs
                getPlayer={(p) => {
                  player.current = p;
                }}
                onReady={onReady}
                options={{
                  aspectRatio: '16:9',
                  autoplay: true,
                  muted: false,
                  controls: true,
                  fluid: true,
                  controlBar: {
                    volumePanel: {
                      inline: false,
                    },
                  },
                  sources: [
                    {
                      src: data.streaming
                        ? `${REACT_APP_STREAMING_URL}/${data.slug}.m3u8`
                        : `${http.defaults.baseURL}/post/video/view/${data.slug}/${data.videoName}`,
                      type: data.streaming
                        ? 'application/x-mpegURL'
                        : 'video/mp4',
                    },
                  ],
                }}
              />

              <Box direction="row" align="center" justify="between">
                {data.streaming ? (
                  <Text>
                    {liveStreamCount <= 1
                      ? t('Video.userWatching', { count: liveStreamCount })
                      : t('Video.usersWatching', { count: liveStreamCount })}
                  </Text>
                ) : (
                  <Text color="status-disabled">
                    {t(
                      `Video.${
                        data.postReaction.viewsCount === 1
                          ? 'viewCount'
                          : 'viewsCount'
                      }`,
                      { count: data.postReaction.viewsCount }
                    )}
                  </Text>
                )}

                <Box direction="row" gap="medium">
                  <Box direction="row" gap="xsmall" align="center">
                    <Button
                      plain
                      onClick={() =>
                        data.liked
                          ? dispatch(
                              removePostLikeAction({
                                postId: data.id,
                              })
                            )
                          : dispatch(
                              createPostLikeAction({
                                postId: data.id,
                                type: 'like',
                              })
                            )
                      }
                      icon={
                        data.liked ? (
                          <FavoriteFill color="brand" />
                        ) : (
                          <Favorite color="status-disabled" />
                        )
                      }
                    />
                    <Text color="status-disabled">
                      {data.postReaction.likesCount}
                    </Text>
                  </Box>
                  {data.allowDislike && (
                    <Box direction="row" gap="xsmall" align="center">
                      <Button
                        plain
                        gap="xsmall"
                        onClick={() =>
                          data?.disliked
                            ? dispatch(
                                removePostLikeAction({
                                  postId: data.id,
                                })
                              )
                            : dispatch(
                                createPostLikeAction({
                                  postId: data.id,
                                  type: 'dislike',
                                })
                              )
                        }
                        icon={
                          data.disliked ? (
                            <Dislike color="brand" size="17px" />
                          ) : (
                            <Dislike color="status-disabled" size="17px" />
                          )
                        }
                        label={
                          <Text color="status-disabled">
                            {t('Video.dislike')}
                          </Text>
                        }
                      />
                    </Box>
                  )}
                  <ShareVideo />
                  <AddToFolderDrop
                    postId={data.id}
                    dropLabels={(isActive) => (
                      <Box direction="row" gap="xsmall" align="center">
                        <AddCircle
                          color={isActive ? 'brand' : 'status-disabled'}
                          size="21px"
                        />
                        <Text color={isActive ? 'brand' : 'status-disabled'}>
                          {isActive ? t('common.saved') : t('common.save')}
                        </Text>
                      </Box>
                    )}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          {data.description && (
            <Highlight
              match={matchDescriptionTags}
              renderHighlight={({ match }) => (
                <Text color="brand">{match}</Text>
              )}
              text={data.description!}
            />
          )}
          {renderChatResponsive()}
          <RecommendedVideos />
          <CommentList
            postId={params.id}
            commentCount={data.postReaction.commentsCount}
          />
          {showDeleteConfirmation && (
            <ConfirmDialog
              onConfirm={() => {
                dispatch(removePostAction({ postId: data.id }));
                history.replace('/');
              }}
              onDismiss={() => setShowDeleteConfirmation(false)}
              message={t('Video.removePostConfirmMsg')}
              confirmButtonText={t('common.remove')}
            />
          )}
        </Box>
      )}
    </PrivatePageLayout>
  );
};

export default Video;
