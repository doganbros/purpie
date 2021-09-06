import React, { FC } from 'react';
import { Avatar, Box, Text } from 'grommet';
import { User } from 'grommet-icons';
import { useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';

const Profile: FC = () => {
  const {
    auth: { user },
  } = useSelector((state: AppState) => state);
  return (
    <Box align="end">
      <Box direction="row" align="center" gap="small">
        <Box align="end">
          <Text size="large" weight="bold">
            {`${user?.firstName} ${user?.lastName}`}
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
};

export default Profile;
