import React, { FC, useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Grid,
  InfiniteScroll,
  ResponsiveContext,
  Text,
} from 'grommet';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import ChannelsToFollow from './ChannelsToFollow';
import ZonesToJoin from './ZonesToJoin';
import LastActivities from './LastActivities';
import Searchbar from './Searchbar';
import PostGridItem from '../../../components/utils/PostGridItem/PostGridItem';
import ChannelList from './ChannelList';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  createPostSaveAction,
  getChannelFeedAction,
  getPublicFeedAction,
  getUserFeedAction,
  getZoneFeedAction,
  removePostSaveAction,
} from '../../../store/actions/post.action';

const Timeline: FC = () => {
  const size = useContext(ResponsiveContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    post: { feed },
    zone: { selectedUserZone },
    channel: { selectedChannel },
  } = useSelector((state: AppState) => state);

  const [filters, setFilters] = useState([
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
  ]);

  useEffect(() => {
    const activeFilterId = filters.find((f) => f.active)?.id;
    switch (activeFilterId) {
      case 0:
      case 1:
      case 2:
        if (selectedChannel)
          dispatch(
            getChannelFeedAction({ channelId: selectedChannel.channel.id })
          );
        else if (selectedUserZone) {
          dispatch(
            getZoneFeedAction({
              zoneId: selectedUserZone.zone.id,
              streaming: activeFilterId === 2,
            })
          );
        } else {
          dispatch(getUserFeedAction({ streaming: activeFilterId === 2 }));
        }
        break;
      case 3:
        dispatch(getPublicFeedAction({ sortBy: 'time' }));
        break;
      case 4:
        dispatch(getPublicFeedAction({ sortBy: 'popularity' }));
        break;
      default:
        break;
    }
  }, [filters, selectedChannel]);
  return (
    <PrivatePageLayout
      title="Timeline"
      rightComponent={
        <Box pad="medium" gap="medium">
          <Searchbar />
          <ChannelsToFollow />
          <Divider />
          <ZonesToJoin />
          <LastActivities />
        </Box>
      }
      topComponent={<ChannelList />}
    >
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
        <Grid columns={size !== 'small' ? 'medium' : '100%'}>
          <InfiniteScroll items={feed.data} step={6}>
            {(item: typeof feed.data[0]) => (
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
            )}
          </InfiniteScroll>
        </Grid>
      </Box>
    </PrivatePageLayout>
  );
};

export default Timeline;
