import React, { FC, useState, useContext } from 'react';
import { Box, Button, Grid, ResponsiveContext, Text } from 'grommet';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import ChannelsToFollow from './ChannelsToFollow';
import ZonesToJoin from './ZonesToJoin';
import LastActivities from './LastActivities';
import Profile from './Profile';
import Searchbar from './Searchbar';
import VideoGridItem from '../../../components/utils/VideoGridItem';

const Timeline: FC = () => {
  const size = useContext(ResponsiveContext);

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
      topComponent={
        <Box
          fill
          direction="row"
          align="center"
          gap="medium"
          pad={{ horizontal: 'small' }}
        >
          {Array(30)
            .fill('')
            .map((v, i) => ({ id: i + 1 }))
            .map((v) => (
              <Box key={v.id} align="center">
                <Box
                  width="45px"
                  height="45px"
                  round="45px"
                  background="#eee"
                />
                <Text size="small">Channel</Text>
                <Text size="xsmall" color="dark-1">
                  Subtitle
                </Text>
              </Box>
            ))}
        </Box>
      }
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
          {Array(30)
            .fill('')
            .map(() => ({
              id: Math.random().toString(36).slice(2),
              comments: Math.floor(Math.random() * 100),
              createdAt: '4:30 PM',
              likes: Math.floor(Math.random() * 30),
              saved: Math.random() < 0.5,
              live: Math.random() < 0.5,
              tags: [
                { id: 1, title: '#animals' },
                { id: 2, title: '#sea' },
                { id: 3, title: '#octopus' },
              ],
              thumbnailSrc:
                'https://images.unsplash.com/photo-1601511902608-bd1d92d0edb5?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&dl=stephanie-harlacher-cBHt4js8nVQ-unsplash.jpg&w=1920',
              userAvatarSrc:
                'https://image.flaticon.com/icons/png/512/4721/4721623.png',
              userName: 'Jane Doe',
              videoTitle: 'Information About Octopuses',
              onClickPlay: () => {},
              onClickSave: () => {},
            }))
            .map(
              ({
                id,
                comments,
                createdAt,
                likes,
                live,
                onClickPlay,
                onClickSave,
                saved,
                tags,
                thumbnailSrc,
                userAvatarSrc,
                userName,
                videoTitle,
              }) => (
                <VideoGridItem
                  key={id}
                  id={id}
                  comments={comments}
                  createdAt={createdAt}
                  likes={likes}
                  live={live}
                  onClickPlay={onClickPlay}
                  onClickSave={onClickSave}
                  saved={saved}
                  tags={tags}
                  thumbnailSrc={thumbnailSrc}
                  userAvatarSrc={userAvatarSrc}
                  userName={userName}
                  videoTitle={videoTitle}
                />
              )
            )}
        </Grid>
      </Box>
    </PrivatePageLayout>
  );
};

export default Timeline;
