import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import ChannelSearch from './ChannelSearch';
import PostSearch from './PostSearch';
import ProfileSearch from './ProfileSearch';
import { SearchParams, SearchScope } from './types';
import ZoneSearch from './ZoneSearch';

const Search: FC = () => {
  const { scope } = useParams<SearchParams>();
  switch (scope) {
    case SearchScope.post:
      return <PostSearch />;
    case SearchScope.channel:
      return <ChannelSearch />;
    case SearchScope.profile:
      return <ProfileSearch />;
    case SearchScope.zone:
      return <ZoneSearch />;
    default:
      return null;
  }
};

export default Search;
