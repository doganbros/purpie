import React, { FC, useEffect } from 'react';
import { Box, Spinner, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import {
  searchChannelAction,
  searchPostAction,
  searchUserAction,
  searchZoneAction,
} from '../../../store/actions/search.action';
import { SearchScope } from '../../../store/types/search.types';
import ChannelsToFollow from '../timeline/ChannelsToFollow';
import LastActivities from '../timeline/LastActivities';
import ZonesToJoin from '../timeline/ZonesToJoin';
import SearchInput from './SearchInput';
import { AppState } from '../../../store/reducers/root.reducer';
import PostResults from './PostResults';
import ZoneResults from './ZoneResults';
import ChannelResults from './ChannelResults';
import UserResults from './UserResults';

interface SearchParams {
  value: string;
  scope: SearchScope;
}

const Search: FC = () => {
  const { value, scope } = useParams<SearchParams>();
  const dispatch = useDispatch();
  const {
    search: { loading, searchResults },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    switch (scope) {
      case SearchScope.channel:
        dispatch(searchChannelAction({ searchTerm: value }));
        break;
      case SearchScope.user:
        dispatch(searchUserAction({ name: value }));
        break;
      case SearchScope.zone:
        dispatch(searchZoneAction({ searchTerm: value }));
        break;
      case SearchScope.post:
        dispatch(searchPostAction({ searchTerm: value }));
        break;
      default:
        break;
    }
  }, [value, scope]);

  const renderResults = () => {
    if (loading) {
      return <Spinner />;
    }
    if (!searchResults) {
      return null;
    }
    if (searchResults.data.length === 0) {
      return <Text>Nothing Found</Text>;
    }
    switch (searchResults.scope) {
      case SearchScope.post:
        return <PostResults posts={searchResults.data} onMore={() => {}} />;
      case SearchScope.zone:
        return <ZoneResults zones={searchResults.data} onMore={() => {}} />;
      case SearchScope.channel:
        return (
          <ChannelResults channels={searchResults.data} onMore={() => {}} />
        );
      case SearchScope.user:
        return <UserResults users={searchResults.data} onMore={() => {}} />;
      default:
        return null;
    }
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
        <Text weight="bold">
          {scope[0].toUpperCase() + scope.substring(1)} Results
        </Text>
        {renderResults()}
      </Box>
    </PrivatePageLayout>
  );
};

export default Search;
