import React, { FC } from 'react';
import { Box, InfiniteScroll } from 'grommet';
import UserSearchItem from '../../../components/utils/UserSearchItem';
import { UserBasic } from '../../../store/types/auth.types';

interface UserResultsProps {
  users: UserBasic[];
  onMore: () => any;
}
const UserResults: FC<UserResultsProps> = ({ users, onMore }) => (
  <InfiniteScroll step={6} items={users} onMore={onMore}>
    {(item: UserBasic) => (
      <Box margin={{ vertical: 'xsmall' }}>
        <UserSearchItem user={item} />
      </Box>
    )}
  </InfiniteScroll>
);

export default UserResults;
