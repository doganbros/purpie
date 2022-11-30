import { Box, Text } from 'grommet';
import React, { FC } from 'react';
import { UserBasic } from '../../store/types/auth.types';
import { UserAvatar } from './Avatars/UserAvatar';

interface UserSearchItemProps {
  user: UserBasic;
}

const UserSearchItem: FC<UserSearchItemProps> = ({ user }) => (
  <Box direction="row" align="center" gap="small" key={user.id}>
    <Box flex={{ shrink: 0 }}>
      <UserAvatar name={user.fullName} id={user.id} src={user.displayPhoto} />
    </Box>
    <Box fill align="end" direction="row" gap="small">
      <Text color="brand" weight="bold">
        {user.fullName}
      </Text>
      <Text color="status-disabled" size="small">
        {user.userName}
      </Text>
    </Box>
  </Box>
);
export default UserSearchItem;
