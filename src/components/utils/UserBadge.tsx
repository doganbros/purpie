import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { AnchorLink } from './AnchorLink';

interface UserBadgeProps {
  firstName?: string;
  lastName?: string;
  url: string;
}

const UserBadge: FC<UserBadgeProps> = ({ firstName, lastName, url }) => {
  return (
    <AnchorLink
      to={url}
      label={
        <Box gap="xsmall" align="center" direction="row">
          <Text size="18px">@</Text>
          <Text size="15px">
            {firstName} {lastName}
          </Text>
        </Box>
      }
      size="15px"
    />
  );
};

export default UserBadge;
