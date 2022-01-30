import { Box, InfiniteScroll, Text } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import ChannelSearchItem from '../../../components/utils/channel/ChannelSearchItem';
import Divider from '../../../components/utils/Divider';
import { searchChannelAction } from '../../../store/actions/search.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { ChannelListItem } from '../../../store/types/channel.types';
import { SearchScope } from '../../../store/types/search.types';
import ChannelsToFollow from '../timeline/ChannelsToFollow';
import LastActivities from '../timeline/LastActivities';
import ZonesToJoin from '../timeline/ZonesToJoin';
import SearchInput from './SearchInput';

interface SearchParams {
  value: string;
  scope: SearchScope;
}

const ChannelSearch: FC = () => {
  const { value } = useParams<SearchParams>();
  const dispatch = useDispatch();

  const {
    search: { searchResults },
  } = useSelector((state: AppState) => state);

  const getSearchResults = (skip?: number) => {
    dispatch(
      searchChannelAction({
        searchTerm: value,
        skip,
      })
    );
  };
  useEffect(() => {
    getSearchResults();
  }, [value]);

  const renderResults = () => {
    if (!searchResults || searchResults.scope !== SearchScope.channel) {
      return null;
    }
    if (searchResults.data.length === 0) {
      return <Text>Nothing Found</Text>;
    }
    return (
      <InfiniteScroll
        step={6}
        items={searchResults.data}
        onMore={() => {
          getSearchResults(searchResults.data.length);
        }}
      >
        {(item: ChannelListItem) => (
          <Box margin={{ vertical: 'xsmall' }}>
            <ChannelSearchItem channel={item} />
          </Box>
        )}
      </InfiniteScroll>
    );
  };

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
        <Text weight="bold">Channel Results</Text>
        {renderResults()}
      </Box>
    </PrivatePageLayout>
  );
};

export default ChannelSearch;
