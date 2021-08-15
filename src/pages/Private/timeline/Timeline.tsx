import React, { FC, useState } from 'react';
import { Box, Button, Text, TextInput } from 'grommet';
import { Search } from 'grommet-icons';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import ChannelsToFollow from './ChannelsToFollow';
import ZonesToJoin from './ZonesToJoin';
import LastActivities from './LastActivities';
import Profile from './Profile';

const Timeline: FC = () => {
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
          <TextInput
            icon={<Search color="light-4" />}
            reverse
            placeholder="Search"
          />
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
          {Array(30).fill(
            <Box align="center">
              <Box width="45px" height="45px" round="45px" background="#eee" />
              <Text size="small">Channel</Text>
              <Text size="xsmall" color="dark-1">
                Subtitle
              </Text>
            </Box>
          )}
        </Box>
      }
    >
      <Box pad={{ vertical: 'medium' }}>
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
      </Box>
    </PrivatePageLayout>
  );
};

export default Timeline;
