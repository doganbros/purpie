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
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import ChannelsToFollow from './ChannelsToFollow';
import ZonesToJoin from './ZonesToJoin';
import LastActivities from './LastActivities';
import Searchbar from './Searchbar';
import VideoGridItem from '../../../components/utils/VideoGridItem';
import ChannelList from './ChannelList';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  getPublicFeedAction,
  getUserFeedAction,
  getZoneFeedAction,
} from '../../../store/actions/activity.action';

dayjs.extend(relativeTime);

const Timeline: FC = () => {
  const size = useContext(ResponsiveContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    activity: { feed },
    zone: { selectedUserZone },
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
      case 3:
      case 4:
        dispatch(getPublicFeedAction(30, 0));
        break;
      default:
        if (selectedUserZone) {
          dispatch(getZoneFeedAction(selectedUserZone.zone.id, 30, 0));
        } else {
          dispatch(getUserFeedAction(30, 0));
        }
    }
  }, [filters]);
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
        <Grid
          columns={size !== 'small' ? 'medium' : '100%'}
          gap={{ row: 'large', column: 'medium' }}
        >
          <InfiniteScroll items={feed.data} step={6}>
            {(item: typeof feed.data[0]) => (
              <VideoGridItem
                key={item.slug}
                slug={item.slug}
                id={item.id}
                comments={item.commentsCount}
                createdAt={dayjs(item.createdOn).fromNow()}
                likes={item.likesCount}
                live={item.liveStream}
                onClickPlay={() => history.push(`video/${item.id}`)}
                onClickSave={() => {}}
                saved={false}
                tags={item.tags}
                createdBy={item.createdBy}
                videoTitle={item.title}
                videoName={item.videoName}
              />
            )}
          </InfiniteScroll>
        </Grid>
      </Box>
    </PrivatePageLayout>
  );
};

export default Timeline;
