import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import videojs from 'video.js';
import { Box, Button, Layer, Menu, Text } from 'grommet';
import {
  AddCircle,
  Chat as ChatIcon,
  Dislike,
  Like,
  More,
  SettingsOption,
  ShareOption,
} from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import {
  createPostLikeAction,
  createPostSaveAction,
  getPostDetailAction,
  removePostAction,
  removePostLikeAction,
  removePostSaveAction,
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
import {
  getTimezoneTimeFromUTC,
  matchDescriptionTags,
} from '../../../helpers/utils';
import PurpieLogoAnimated from '../../../assets/purpie-logo/purpie-logo-animated';

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

  const player = useRef<videojs.Player | null>(null);

  const maybeSendViewStat = () => {
    if (previousTime.current > startedFrom.current) {
      postViewStats(
        +params.id,
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
      postViewStats(+params.id, 0, 0);
    });
  };

  const chatComponent = useMemo(
    () =>
      data ? (
        <Chat medium="post" id={+params.id} handleTypingEvent canAddFile />
      ) : null,
    [data, params.id]
  );

  const actionMenu = useMemo(() => {
    if (data?.createdBy?.id === user?.id) {
      return [
        {
          label: t('common.edit'),
          onClick: () => setShowSettings((state) => !state),
        },
        {
          label: t('common.delete'),
          onClick: () => setShowDeleteConfirmation(true),
        },
      ];
    }
    return [
      { label: t('Video.followChannel') },
      { label: t('Video.joinZone') },
      { label: t('Video.report') },
    ];
  }, [data, user]);

  useEffect(() => {
    dispatch(getPostDetailAction(+params.id));
  }, [params.id]);

  useEffect(() => {
    if (data) setLiveStreamCount(data.postReaction.liveStreamViewersCount);
  }, [data]);

  useEffect(() => {
    if (data && +params.id === data.id && data.streaming) {
      const handleCountChange = ({
        counter,
        postId,
      }: {
        counter: number;
        postId: number;
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
      {loading || !data ? (
        <Layer responsive={false} plain>
          <PurpieLogoAnimated width={50} height={50} color="#956aea" />
        </Layer>
      ) : (
        <Box gap="large" pad={{ vertical: 'medium' }}>
          <Box>
            <Box justify="between" direction="row">
              <Box>
                <Text weight="bold" size="large">
                  {data.title}
                </Text>
              </Box>
              <Text weight="bold">
                {getTimezoneTimeFromUTC(data.createdOn).fromNow()}
              </Text>
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
                    <ChannelBadge name={data.channel.name} url="/" />
                  )}
                  <UserBadge url="/" fullName={data?.createdBy?.fullName} />
                </Box>
              )) || <Box />}
              <Menu
                margin={{ right: '-10px' }}
                plain
                icon={
                  data?.createdBy?.id === user?.id ? (
                    <SettingsOption size="medium" color="brand" />
                  ) : (
                    <More size="medium" color="brand" />
                  )
                }
                items={actionMenu}
                dropAlign={{ top: 'bottom', left: 'left' }}
              />
            </Box>
            <Box margin={{ top: 'small' }} gap="medium">
              <VideoJs
                getPlayer={(p) => {
                  player.current = p;
                }}
                onReady={onReady}
                options={{
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
                    {
                      (t(
                        `Video.${
                          liveStreamCount === 1
                            ? 'userWatching'
                            : 'usersWatching'
                        }`
                      ),
                      { count: liveStreamCount })
                    }
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
                          ? dispatch(removePostLikeAction({ postId: data.id }))
                          : dispatch(createPostLikeAction({ postId: data.id }))
                      }
                      icon={
                        data.liked ? (
                          <Like color="brand" size="17px" />
                        ) : (
                          <Like color="status-disabled" size="17px" />
                        )
                      }
                    />
                    <Text color="status-disabled">
                      {data.postReaction.likesCount}
                    </Text>
                  </Box>
                  <Box direction="row" gap="xsmall" align="center">
                    <Dislike color="status-disabled" size="17px" />
                    <Text color="status-disabled">{t('Video.dislike')}</Text>
                  </Box>
                  <Box direction="row" gap="xsmall" align="center">
                    <ShareOption color="status-disabled" size="19px" />
                    <Text color="status-disabled">{t('common.share')}</Text>
                  </Box>
                  <Box
                    direction="row"
                    gap="xsmall"
                    align="center"
                    onClick={() => {
                      if (data.saved)
                        dispatch(removePostSaveAction({ postId: data.id }));
                      else dispatch(createPostSaveAction({ postId: data.id }));
                    }}
                  >
                    <AddCircle
                      color={data.saved ? 'brand' : 'status-disabled'}
                      size="21px"
                    />
                    <Text color={data.saved ? 'brand' : 'status-disabled'}>
                      {data.saved ? t('common.saved') : t('common.save')}
                    </Text>
                  </Box>
                  <Box direction="row" gap="xsmall" align="center">
                    <ChatIcon color="status-disabled" size="17px" />
                    <Text color="status-disabled">
                      {data.postReaction.commentsCount}
                    </Text>
                  </Box>
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
              text={data.description}
            />
          )}
          <RecommendedVideos />
          <CommentList postId={+params.id} />
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
