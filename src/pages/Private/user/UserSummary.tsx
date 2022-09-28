import { Box, Text } from 'grommet';
import React, { FC } from 'react';
import Divider from '../../../components/utils/Divider';
import InitialsAvatar from '../../../components/utils/InitialsAvatar';
import { UserBasic } from '../../../store/types/auth.types';

export const UserSummary: FC<UserBasic> = ({
  fullName,
  id,
  userName,
  email,
}) => (
  <Box gap="medium">
    <InitialsAvatar
      value={fullName}
      id={id}
      size="355px"
      round="medium"
      textProps={{ size: '120px' }}
    />
    <Text weight="bold" size="large" alignSelf="end">
      {fullName}
    </Text>
    <Divider />
    <Box align="end" gap="small">
      <Text weight="bold">User Name</Text>
      <Text color="status-disabled">{userName}</Text>
      <Text weight="bold">Email</Text>
      <Text color="status-disabled">{email}</Text>
    </Box>
  </Box>
);
