import React, { FC, useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  InfiniteScroll,
  ResponsiveContext,
  Text,
} from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import PostGridItem from '../../../components/post/PostGridItem';
import SearchBar from '../../../components/utils/SearchBar';
import { getFeedListAction } from '../../../store/actions/post.action';
import { AppState } from '../../../store/reducers/root.reducer';
import ChannelList from './ChannelList';
import ChannelsToFollow from './ChannelsToFollow';
import Notifications from './Notifications';
import ZonesToJoin from './ZonesToJoin';
import AddContent from '../../../layers/add-content/AddContent';
import { FeedPayload, Post } from '../../../store/types/post.types';
import EmptyFeedContent from './EmptyFeedContent';
import { LoadingState } from '../../../models/utils';
import InvitationList from './InvitationList';
import i18n from '../../../config/i18n/i18n-config';
import PurpieLogoAnimated from '../../../assets/purpie-logo/purpie-logo-animated';
import { DELAY_TIME } from '../../../helpers/constants';
import useWaitTime from '../../../hooks/useDelayTime';
import InviteToChannel from './InviteToChannel';
import InviteToZone from './InviteToZone';
import ChannelMembers from './ChannelMembers';

const tabs = [
  {
    id: 0,
    name: i18n.t('Timeline.all'),
  },
  {
    id: 1,
    name: i18n.t('common.following'),
  },
  {
    id: 2,
    name: i18n.t('Timeline.live'),
  },
  {
    id: 3,
    name: i18n.t('Timeline.newest'),
  },
  {
    id: 4,
    name: i18n.t('Timeline.popular'),
  },
];

const Timeline: FC = () => {
  const size = useContext(ResponsiveContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { delay, setDelay } = useWaitTime(DELAY_TIME);

  const handleWaiting = () => {
    setDelay(true);
  };
  const {
    post: { feed },
    zone: {
      selectedUserZone,
      getUserZones: { userZones },
    },
    channel: { selectedChannel },
  } = useSelector((state: AppState) => state);

  const [showAddContent, setShowAddContent] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [hasNewlyCreatedFeed, setHasNewlyCreatedFeed] = useState(false);

  const getFeed = (skip?: number) => {
    const request: FeedPayload = { skip };
    switch (activeTab) {
      case 0:
      case 1:
      case 2:
        if (selectedChannel) request.channelId = selectedChannel.channel.id;
        else if (selectedUserZone) request.zoneId = selectedUserZone.zone.id;
        request.streaming = activeTab === 2;
        request.following = activeTab === 1;

        dispatch(getFeedListAction(request));
        break;
      case 3:
        dispatch(getFeedListAction({ skip, public: true, sortBy: 'time' }));
        break;
      case 4:
        dispatch(
          getFeedListAction({ skip, public: true, sortBy: 'popularity' })
        );
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const newlyCreatedFeeds = feed.data.filter((f) => f.newlyCreated);
    if (newlyCreatedFeeds.length > 0 && activeTab !== 0) {
      setHasNewlyCreatedFeed(true);
      setActiveTab(0);
    }
  }, [feed]);

  useEffect(() => {
    if (!hasNewlyCreatedFeed) getFeed();
    setHasNewlyCreatedFeed(false);
  }, [activeTab, selectedChannel]);

  const getTimelineContent = () => {
    if (
      [LoadingState.loading, LoadingState.pending].includes(
        feed.loadingState
      ) ||
      delay
    )
      return (
        <Box
          justify="center"
          align="center"
          alignSelf="center"
          height="medium"
          pad={{ top: 'large' }}
        >
          <PurpieLogoAnimated width={100} height={100} color="brand" />
        </Box>
      );

    if (!feed.data.length)
      return <EmptyFeedContent onAddContent={() => setShowAddContent(true)} />;

    return (
      <Grid columns={size !== 'small' ? 'medium' : '100%'}>
        <InfiniteScroll
          items={feed.data}
          step={6}
          onMore={() => {
            getFeed(feed.data.length);
          }}
        >
          {(item: Post) => {
            return (
              <PostGridItem
                key={item.id}
                post={item}
                onClickPlay={() => history.push(`video/${item.id}`)}
              />
            );
          }}
        </InfiniteScroll>
      </Grid>
    );
  };

  return (
    <PrivatePageLayout
      title={t('Timeline.title')}
      rightComponent={
        <Box pad="medium" gap="medium">
          <SearchBar />
          {selectedChannel && selectedChannel.id && (
            <Box gap="medium">
              <InviteToChannel channel={selectedChannel} />
              <InviteToZone
                zone={userZones?.find(
                  (z) => z.zone.id === selectedChannel?.channel.zoneId
                )}
              />
            </Box>
          )}
          {!selectedChannel && <InvitationList />}
          {selectedChannel && (
            <ChannelMembers channelId={selectedChannel.channel.id} />
          )}
          <Divider />
          <ChannelsToFollow />
          <Divider />
          <ZonesToJoin />
          <Divider />
          <Notifications />
        </Box>
      }
      topComponent={<ChannelList handleWaiting={handleWaiting} />}
    >
      {showAddContent && (
        <AddContent onDismiss={() => setShowAddContent(false)} />
      )}
      <Box pad={{ vertical: 'medium' }} gap="medium">
        <Box direction="row" justify="between" align="center">
          <Text weight="bold">Timeline</Text>
          <Box direction="row" gap="small">
            {tabs.map((tab) => (
              <Button
                key={`timelineTab${tab.id}`}
                onClick={() => {
                  setDelay(true);
                  setActiveTab(tab.id);
                }}
              >
                <Text
                  size="small"
                  weight={activeTab === tab.id ? 'bold' : 'normal'}
                  color={activeTab === tab.id ? 'brand' : 'status-disabled'}
                >
                  {tab.name}
                </Text>
              </Button>
            ))}
          </Box>
        </Box>
        {getTimelineContent()}
      </Box>
    </PrivatePageLayout>
  );
};

export default Timeline;
