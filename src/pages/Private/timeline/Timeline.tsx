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
import {
  DELAY_TIME,
  INVITATION_AMOUNT_MORE,
  SUGGESTION_AMOUNT_MORE,
} from '../../../helpers/constants';
import useWaitTime from '../../../hooks/useDelayTime';
import InviteToChannel from './InviteToChannel';
import InviteToZone from './InviteToZone';
import ChannelMembers from './ChannelMembers';
import { getInvitationListAction } from '../../../store/actions/invitation.action';
import { listChannelUsersAction } from '../../../store/actions/channel.action';
import {
  getChannelSuggestionsAction,
  getNotificationCountAction,
  getNotificationsAction,
  getZoneSuggestionsAction,
} from '../../../store/actions/activity.action';
import ChannelShortInfo from './ChannelShortInfo';
import ChannelBadge from '../../../components/utils/channel/ChannelBadge';
import ZoneBadge from '../../../components/utils/zone/ZoneBadge';

const tabs = [
  {
    id: 0,
    name: i18n.t('Timeline.all'),
  },
  {
    id: 1,
    name: i18n.t('common.following'),
  },
];

const Timeline: FC = () => {
  const size = useContext(ResponsiveContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { delay, setDelay } = useWaitTime(DELAY_TIME);
  const { delay: loading } = useWaitTime(DELAY_TIME);

  const handleWaiting = () => {
    setDelay(true);
  };
  const {
    post: { feed },
    zone: {
      selectedUserZone,
      getUserZones: { userZones },
    },
    activity: { zoneSuggestions, channelSuggestions },
    channel: { selectedChannel },
    invitation: { invitations },
  } = useSelector((state: AppState) => state);

  const [showAddContent, setShowAddContent] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [hasNewlyCreatedFeed, setHasNewlyCreatedFeed] = useState(false);

  const getFeed = (skip?: number) => {
    const request: FeedPayload = { skip };
    switch (activeTab) {
      case 0:
        dispatch(getFeedListAction(request));
        break;
      case 1:
        if (selectedChannel) request.channelId = selectedChannel.channel.id;
        else if (selectedUserZone) request.zoneId = selectedUserZone.zone.id;
        request.following = true;
        dispatch(getFeedListAction(request));
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

  const getSideComponentsLoadingState = () => {
    return (
      invitations?.loading ||
      channelSuggestions?.loading ||
      zoneSuggestions?.loading ||
      loading
    );
  };

  useEffect(() => {
    dispatch(getInvitationListAction(INVITATION_AMOUNT_MORE));
    dispatch(getChannelSuggestionsAction(SUGGESTION_AMOUNT_MORE, 0));
    if (selectedChannel) {
      dispatch(
        listChannelUsersAction(
          selectedChannel.channel.id,
          SUGGESTION_AMOUNT_MORE,
          0
        )
      );
    }
    dispatch(getZoneSuggestionsAction(SUGGESTION_AMOUNT_MORE, 0));
    dispatch(getNotificationCountAction());
    dispatch(getNotificationsAction(INVITATION_AMOUNT_MORE, 0, 'all'));
  }, []);

  const getTimelineContent = () => {
    if (
      [LoadingState.loading, LoadingState.pending].includes(
        feed.loadingState
      ) ||
      delay
    )
      return (
        <Box height="100vh">
          <Box
            justify="center"
            align="center"
            alignSelf="center"
            height="medium"
            pad={{ top: 'large' }}
          >
            <PurpieLogoAnimated width={100} height={100} color="#9060EB" />
          </Box>
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
        getSideComponentsLoadingState() ? (
          <Box width="100%" height="100vh" justify="center" align="center">
            <PurpieLogoAnimated width={100} height={100} color="#9060EB" />
          </Box>
        ) : (
          <Box>
            <Box pad="medium">
              <SearchBar />
            </Box>
            {selectedChannel && <ChannelShortInfo />}
            {/* <Box
              margin={{ horizontal: 'small', top: 'medium' }}
              style={{ zIndex: 1 }}
              pad={{ horizontal: 'xsmall' }}
            >
              <Button
                primary
                onClick={() => console.log('test')}
                label={t('common.follow')}
              />
            </Box> */}
            <Box pad="medium" gap="medium">
              {selectedChannel &&
                selectedChannel.id &&
                selectedChannel.channelRole.canInvite && (
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
              {!selectedChannel &&
                !invitations.loading &&
                invitations.data.length !== 0 && <Divider />}
              {selectedChannel && (
                <ChannelMembers channelId={selectedChannel.channel.id} />
              )}
              {selectedChannel && <Divider />}
              <ChannelsToFollow />
              {!channelSuggestions.loading &&
                channelSuggestions.data.length !== 0 && <Divider />}
              <ZonesToJoin />
              {!zoneSuggestions.loading &&
                zoneSuggestions.data.length !== 0 && <Divider />}
              <Notifications />
            </Box>
          </Box>
        )
      }
      topComponent={<ChannelList handleWaiting={handleWaiting} />}
    >
      {showAddContent && (
        <AddContent onDismiss={() => setShowAddContent(false)} />
      )}
      <Box pad={{ vertical: 'medium' }} gap="medium">
        <Box direction="row" justify="between" align="center">
          {(selectedChannel || selectedUserZone) && (
            <Box direction="row" gap="small" align="center">
              <Box direction="row" align="center" gap="xsmall">
                <Text size="small" color="status-disabled">
                  You are at{' '}
                </Text>
                {selectedUserZone && (
                  <ZoneBadge
                    truncateWith="230px"
                    textProps={{ size: 'small', weight: 'bold' }}
                    name={selectedUserZone?.zone.name}
                    subdomain={selectedUserZone?.zone.subdomain}
                  />
                )}
                {selectedChannel && (
                  <ChannelBadge
                    truncateWith="230px"
                    textProps={{ size: 'small', weight: 'bold' }}
                    url="/"
                    name={selectedChannel?.channel.name}
                  />
                )}
              </Box>
            </Box>
          )}

          {!selectedChannel && !selectedUserZone && (
            <Box direction="row" gap="small" justify="end" fill="horizontal">
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
          )}
        </Box>
        {getTimelineContent()}
      </Box>
    </PrivatePageLayout>
  );
};

export default Timeline;
