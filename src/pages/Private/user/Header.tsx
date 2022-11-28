import { Box, Text } from 'grommet';
import React, { FC } from 'react';
import { UserAvatar } from '../../../components/utils/Avatars/UserAvatar';
import { User } from '../../../store/types/auth.types';

interface HeaderProps {
  user: User;
}

const Header: FC<HeaderProps> = ({ user }) => (
  <Box flex="grow" direction="row" align="center" gap="small">
    <UserAvatar
      id={user.id}
      name={user.fullName}
      size="70px"
      textProps={{
        size: '25px',
      }}
    />
    <Box>
      <Text weight="bold">{user.fullName}</Text>
      <Text size="small" color="status-disabled">
        {user.userName}
      </Text>
    </Box>
  </Box>
);

export default Header;
