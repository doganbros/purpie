import React, { FC, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
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
import Profile from './Profile';
import Searchbar from './Searchbar';
import VideoGridItem from '../../../components/utils/VideoGridItem';
import { timeLineList } from './data/timeline-list';
import ChannelList from './ChannelList';

const Timeline: FC = () => {
  const size = useContext(ResponsiveContext);
  const history = useHistory();

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
  return (
    <PrivatePageLayout
      title="Timeline"
      rightComponent={
        <Box pad="medium" gap="medium">
          <Profile />
          <Divider />
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
          <InfiniteScroll items={timeLineList} step={6}>
            {(item: typeof timeLineList[0]) => (
              <VideoGridItem
                key={item.id}
                id={item.id}
                comments={item.comments}
                createdAt={item.createdAt}
                likes={item.likes}
                live={item.live}
                onClickPlay={() => item.onClickPlay(history)}
                onClickSave={item.onClickSave}
                saved={item.saved}
                tags={item.tags}
                thumbnailSrc={item.thumbnailSrc}
                userAvatarSrc={item.userAvatarSrc}
                userName={item.userName}
                videoTitle={item.videoTitle}
              />
            )}
          </InfiniteScroll>
        </Grid>
      </Box>
    </PrivatePageLayout>
  );
};

export default Timeline;
