import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import videojs from 'video.js';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Box, Button, Menu, Layer, Spinner, Text } from 'grommet';
import {
  Chat as ChatIcon,
  SettingsOption,
  Like,
  Dislike,
  ShareOption,
  More,
  AddCircle,
} from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import {
  createPostLikeAction,
  getPostDetailAction,
  removePostLikeAction,
  removePostAction,
  removePostSaveAction,
  createPostSaveAction,
} from '../../../store/actions/post.action';
import { AppState } from '../../../store/reducers/root.reducer';
import RecommendedVideos from './RecommendedVideos';
import VideoJs from '../../../components/utils/PostGridItem/VideoJs';
import { http } from '../../../config/http';
import { postViewStats } from '../../../store/services/post.service';
import CommentList from './Comments/CommentList';
import Chat from '../../../components/chat/Chat';
import { socket } from '../../../helpers/socket';
import Settings from './Settings';
import appHistory from '../../../helpers/history';
import ConfirmDialog from '../../../components/utils/ConfirmDialog';
import ChannelBadge from '../../../components/utils/channel/ChannelBadge';
import ZoneBadge from '../../../components/utils/zone/ZoneBadge';
import UserBadge from '../../../components/utils/UserBadge';
import Highlight from '../../../components/utils/Highlight';

dayjs.extend(relativeTime);

interface RouteParams {
  id: string;
}

const { REACT_APP_STREAMING_URL } = process.env;

const Video: FC = () => {
  const DECISECOND = 10;
  const params = useParams<RouteParams>();
  const [liveStreamCount, setLiveStreamCount] = useState(0);
  const dispatch = useDispatch();
  const {
    post: {
      postDetail: { data, loading },
    },
    auth: { user },
  } = useSelector((state: AppState) => state);
  const [settings, setSettings] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

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

  const rightComponent = useMemo(() => {
    return settings ? (
      <Settings
        setSettings={setSettings}
        setDeleteConfirmation={setDeleteConfirmation}
      />
    ) : (
      <Chat medium="post" id={+params.id} handleTypingEvent />
    );
  }, [data, settings]);

  const actionMenu = useMemo(() => {
    if (data?.createdBy?.id === user?.id) {
      return [
        { label: 'Edit', onClick: () => setSettings((state) => !state) },
        { label: 'Delete', onClick: () => setDeleteConfirmation(true) },
      ];
    }
    return [
      { label: 'Follow This Channel' },
      { label: 'Join This Zone' },
      { label: 'Report' },
    ];
  }, [data, user]);

  useEffect(() => {
    dispatch(getPostDetailAction(+params.id));
  }, []);

  useEffect(() => {
    if (data && +params.id === data.id && data.streaming) {
      setLiveStreamCount(data.postReaction.liveStreamViewersCount);
      socket.emit('join_post', +params.id);

      socket.on(`stream_viewer_count_change_${params.id}`, setLiveStreamCount);

      return () => {
        socket.off(
          `stream_viewer_count_change_${params.id}`,
          setLiveStreamCount
        );
        socket.emit('leave_post', +params.id);
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
      title={data?.title || 'Loading'}
      rightComponent={rightComponent}
    >
      {loading || !data ? (
        <Layer responsive={false} plain>
          <Spinner />
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
              <Text weight="bold">{dayjs(data.createdOn).fromNow()}</Text>
            </Box>
            <Box justify="between" align="center" direction="row">
              {(data?.type === 'video' && (
                <Box direction="row" align="center" gap="medium">
                  <ChannelBadge name={data?.channel?.name} url="/" />
                  <ZoneBadge
                    name={data?.channel?.zone?.name}
                    subdomain={data?.channel?.zone?.subdomain}
                  />
                  <UserBadge
                    url="/"
                    firstName={data?.createdBy?.firstName}
                    lastName={data?.createdBy?.lastName}
                  />
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
                    {liveStreamCount}{' '}
                    {liveStreamCount === 1
                      ? `user is watching`
                      : 'users are watching'}
                  </Text>
                ) : (
                  <Text color="status-disabled">
                    {data.postReaction.viewsCount === 1
                      ? `${data.postReaction.viewsCount} view`
                      : `${data.postReaction.viewsCount} views`}
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
                    <Text color="status-disabled">Dislike</Text>
                  </Box>
                  <Box direction="row" gap="xsmall" align="center">
                    <ShareOption color="status-disabled" size="19px" />
                    <Text color="status-disabled">Share</Text>
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
                      {data.saved ? 'Saved' : 'Save'}
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
          <Highlight
            startsWith="#"
            render={(tag: string) => <Text color="#9060EB">{tag}</Text>}
            text={data.description}
          />
          <RecommendedVideos />
          <CommentList postId={+params.id} />
          {deleteConfirmation && (
            <ConfirmDialog
              onConfirm={() => {
                dispatch(removePostAction({ postId: data.id }));
                appHistory.replace('/');
              }}
              onDismiss={() => setDeleteConfirmation(false)}
              message="Are you sure you want to remove this post?"
              confirmButtonText="Remove"
            />
          )}
        </Box>
      )}
    </PrivatePageLayout>
  );
};

export default Video;
