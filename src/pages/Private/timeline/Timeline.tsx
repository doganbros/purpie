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
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import PostGridItem from '../../../components/post/PostGridItem';
import SearchBar from '../../../components/utils/SearchBar';
import {
  createPostSaveAction,
  getChannelFeedAction,
  getPublicFeedAction,
  getUserFeedAction,
  getZoneFeedAction,
  removePostSaveAction,
} from '../../../store/actions/post.action';
import { AppState } from '../../../store/reducers/root.reducer';
import ChannelList from './ChannelList';
import ChannelsToFollow from './ChannelsToFollow';
import LastActivities from './LastActivities';
import ZonesToJoin from './ZonesToJoin';
import AddContent from '../../../layers/add-content/AddContent';
import { Post } from '../../../store/types/post.types';
import EmptyFeedContent from './EmptyFeedContent';
import { LoadingState } from '../../../models/utils';
import InvitationList from './InvitationList';

const initialFilters = [
  {
    id: 0,
    filterName: 'All',
    active: true,
  },
  {
    id: 1,
    filterName: 'Following',
    active: false,
  },
  {
    id: 2,
    filterName: 'Live',
    active: false,
  },
  {
    id: 3,
    filterName: 'Newest',
    active: false,
  },
  {
    id: 4,
    filterName: 'Popular',
    active: false,
  },
];

const Timeline: FC = () => {
  const size = useContext(ResponsiveContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    post: { feed },
    zone: { selectedUserZone },
    channel: { selectedChannel },
  } = useSelector((state: AppState) => state);

  const [showAddContent, setShowAddContent] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  const getFeed = (skip?: number) => {
    const activeFilterId = filters.find((f) => f.active)?.id;
    switch (activeFilterId) {
      case 0:
      case 1:
      case 2:
        if (selectedChannel)
          dispatch(
            getChannelFeedAction({
              skip,
              channelId: selectedChannel.channel.id,
              streaming: activeFilterId === 2,
            })
          );
        else if (selectedUserZone) {
          dispatch(
            getZoneFeedAction({
              skip,
              zoneId: selectedUserZone.zone.id,
              streaming: activeFilterId === 2,
            })
          );
        } else {
          dispatch(
            getUserFeedAction({ skip, streaming: activeFilterId === 2 })
          );
        }
        break;
      case 3:
        dispatch(getPublicFeedAction({ skip, sortBy: 'time' }));
        break;
      case 4:
        dispatch(getPublicFeedAction({ skip, sortBy: 'popularity' }));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getFeed();
  }, [filters, selectedChannel]);

  const getTimelineContent = () => {
    if (
      [LoadingState.loading, LoadingState.pending].includes(feed.loadingState)
    )
      return 'Loading...'; // We can return a loader component later

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
                onClickSave={() => {
                  if (item.saved)
                    dispatch(removePostSaveAction({ postId: item.id }));
                  else dispatch(createPostSaveAction({ postId: item.id }));
                }}
              />
            );
          }}
        </InfiniteScroll>
      </Grid>
    );
  };

  return (
    <PrivatePageLayout
      title="Timeline"
      rightComponent={
        <Box pad="medium" gap="medium">
          <SearchBar />
          <InvitationList />
          <Divider />
          <ChannelsToFollow />
          <Divider />
          <ZonesToJoin />
          <LastActivities />
        </Box>
      }
      topComponent={<ChannelList />}
    >
      {showAddContent && (
        <AddContent onDismiss={() => setShowAddContent(false)} />
      )}
      <Box pad={{ vertical: 'medium' }} gap="medium">
        <Box direction="row" justify="between" align="center">
          <Text weight="bold">Timeline</Text>
          <Box direction="row" gap="small">
            {filters.map((f) => (
              <Button
                key={f.id}
                onClick={() => {
                  setFilters(
                    filters.map((v) => ({ ...v, active: v.id === f.id }))
                  );
                }}
              >
                <Text
                  size="small"
                  weight={f.active ? 'bold' : 'normal'}
                  color={f.active ? 'brand' : 'status-disabled'}
                >
                  {f.filterName}
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
