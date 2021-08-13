import React, { FC, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';

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
        <Box pad="large">
          <Text>Right sidebar</Text>
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
          <Box direction="row">
            {filters.map((f) => (
              <Button
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
