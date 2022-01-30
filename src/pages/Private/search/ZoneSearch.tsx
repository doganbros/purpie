import { Box, InfiniteScroll, Text } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import ZoneSearchItem from '../../../components/utils/zone/ZoneSearchItem';
import Divider from '../../../components/utils/Divider';
import { searchZoneAction } from '../../../store/actions/search.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { ZoneListItem } from '../../../store/types/zone.types';
import { SearchScope } from '../../../store/types/search.types';
import ChannelsToFollow from '../timeline/ChannelsToFollow';
import LastActivities from '../timeline/LastActivities';
import ZonesToJoin from '../timeline/ZonesToJoin';
import SearchInput from './SearchInput';

interface SearchParams {
  value: string;
  scope: SearchScope;
}

const ZoneSearch: FC = () => {
  const { value } = useParams<SearchParams>();
  const dispatch = useDispatch();

  const {
    search: { searchResults },
  } = useSelector((state: AppState) => state);

  const getSearchResults = (skip?: number) => {
    dispatch(
      searchZoneAction({
        searchTerm: value,
        skip,
      })
    );
  };

  useEffect(() => {
    getSearchResults();
  }, [value]);

  const renderResults = () => {
    if (!searchResults || searchResults.scope !== SearchScope.zone) {
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
        {(item: ZoneListItem) => (
          <Box margin={{ vertical: 'xsmall' }}>
            <ZoneSearchItem zone={item} />
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
        <Text weight="bold">Zone Results</Text>
        {renderResults()}
      </Box>
    </PrivatePageLayout>
  );
};

export default ZoneSearch;
