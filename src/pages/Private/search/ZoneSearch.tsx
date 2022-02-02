import { Box, InfiniteScroll, Text } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import ZoneSearchItem from '../../../components/utils/zone/ZoneSearchItem';
import Divider from '../../../components/utils/Divider';
import { searchZoneAction } from '../../../store/actions/zone.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { ZoneListItem } from '../../../store/types/zone.types';
import ChannelsToFollow from '../timeline/ChannelsToFollow';
import LastActivities from '../timeline/LastActivities';
import ZonesToJoin from '../timeline/ZonesToJoin';
import SearchInput from './SearchInput';
import { SearchParams } from './types';

const ZoneSearch: FC = () => {
  const { value } = useParams<SearchParams>();
  const dispatch = useDispatch();

  const {
    zone: {
      search: { results },
    },
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
    if (results.data.length === 0) {
      return <Text>Nothing Found</Text>;
    }
    return (
      <InfiniteScroll
        step={6}
        items={results.data}
        onMore={() => {
          getSearchResults(results.data.length);
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
