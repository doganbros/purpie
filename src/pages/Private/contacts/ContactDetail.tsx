import React, { FC } from 'react';
import { Box, Button, Spinner, Text } from 'grommet';
import Divider from '../../../components/utils/Divider';
import { User } from '../../../store/types/auth.types';
import InitialsAvatar from '../../../components/utils/InitialsAvatar';

interface SelectedUserProps {
  user: User | null;
}

const SelectedUser: FC<SelectedUserProps> = ({ user }) =>
  !user ? (
    <Box pad="large" justify="center" align="center">
      <Spinner />
    </Box>
  ) : (
    <Box pad="medium" gap="medium">
      <InitialsAvatar
        value={`${user.firstName} ${user.lastName}`}
        id={user.id}
        avatarProps={{
          size: '355px',
          round: 'medium',
        }}
        textProps={{ size: '120px' }}
      />
      <Text weight="bold" size="large" alignSelf="end">
        {user.firstName} {user.lastName}
      </Text>
      <Divider />
      <Box align="end" gap="small">
        <Text weight="bold">User Name</Text>
        <Text color="status-disabled">{user.userName}</Text>
        <Text weight="bold">Email</Text>
        <Text color="status-disabled">{user.email}</Text>
      </Box>
      <Button
        primary
        color="status-error"
        alignSelf="center"
        margin={{ vertical: 'medium' }}
        label="Remove from Contacts"
      />
    </Box>
  );

export default SelectedUser;
