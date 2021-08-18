import React, { FC } from 'react';
import { Avatar, Box, Text } from 'grommet';
import { User } from 'grommet-icons';

const Profile: FC = () => (
  <Box align="end">
    <Box direction="row" align="center" gap="small">
      <Box align="end">
        <Text size="large" weight="bold">
          John Doe
        </Text>
        <Text size="small" color="status-disabled">
          Developer
        </Text>
      </Box>
      <Avatar size="xlarge" round="medium" background="brand">
        <User color="white" size="large" />
      </Avatar>
    </Box>
  </Box>
);

export default Profile;
