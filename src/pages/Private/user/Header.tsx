import { Box, Text } from 'grommet';
import React, { FC } from 'react';
import InitialsAvatar from '../../../components/utils/InitialsAvatar';
import { User } from '../../../store/types/auth.types';

interface HeaderProps {
  user: User;
}

const Header: FC<HeaderProps> = ({ user }) => (
  <Box flex="grow" direction="row" align="center" gap="small">
    <InitialsAvatar
      id={user.id}
      value={`${user.firstName} ${user.lastName}`}
      size="70px"
      round="full"
      textProps={{
        size: '25px',
      }}
    />
    <Box>
      <Text weight="bold">
        {user.firstName} {user.lastName}
      </Text>
      <Text size="small" color="status-disabiled">
        {user.userName}
      </Text>
    </Box>
  </Box>
);

export default Header;
