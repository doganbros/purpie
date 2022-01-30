import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { SearchScope } from '../../../store/types/search.types';
import ChannelSearch from './ChannelSearch';
import PostSearch from './PostSearch';
import UserSearch from './UserSearch';
import ZoneSearch from './ZoneSearch';

interface SearchParams {
  value: string;
  scope: SearchScope;
}

const Search: FC = () => {
  const { scope } = useParams<SearchParams>();
  switch (scope) {
    case SearchScope.post:
      return <PostSearch />;
    case SearchScope.channel:
      return <ChannelSearch />;
    case SearchScope.user:
      return <UserSearch />;
    case SearchScope.zone:
      return <ZoneSearch />;
    default:
      return null;
  }
};

export default Search;
