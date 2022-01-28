import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { useParams } from 'react-router-dom';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import { SearchScope } from '../../../store/types/search.types';
import ChannelsToFollow from '../timeline/ChannelsToFollow';
import LastActivities from '../timeline/LastActivities';
import ZonesToJoin from '../timeline/ZonesToJoin';
import SearchInput from './SearchInput';

interface SearchParams {
  value: string;
  scope: SearchScope;
}

const Search: FC = () => {
  const { scope } = useParams<SearchParams>();
  return (
    <PrivatePageLayout
      title="Search"
      topComponent={<SearchInput />}
      rightComponent={
        <Box pad="medium" gap="medium">
          <ChannelsToFollow />
          <Divider />
          <ZonesToJoin />
          <LastActivities />
        </Box>
      }
    >
      <Box pad={{ vertical: 'medium' }} gap="medium">
        <Text weight="bold">
          {scope[0].toUpperCase() + scope.substring(1)} Results
        </Text>
        <Text>Search Type = {scope}</Text>
      </Box>
    </PrivatePageLayout>
  );
};

export default Search;
