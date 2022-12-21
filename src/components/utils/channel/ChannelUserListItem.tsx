import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import EllipsesOverflowText from '../EllipsesOverflowText';
import { UserAvatar } from '../Avatars/UserAvatar';

interface ChannelUserListItemProps {
  id: number;
  name: string;
  userName: string;
  displayPhoto?: string;
}

const ChannelUserListItem: FC<ChannelUserListItemProps> = ({
  id,
  name,
  userName,
  displayPhoto,
}) => {
  return (
    <Box direction="row" align="center" gap="small">
      <UserAvatar id={id} name={name} src={displayPhoto} />
      <Box>
        <EllipsesOverflowText
          maxWidth="212px"
          lineClamp={1}
          size="small"
          weight="bold"
        >
          {name}
        </EllipsesOverflowText>
        <Text size="xsmall" color="status-disabled">
          {userName}
        </Text>
      </Box>
    </Box>
  );
};

export default ChannelUserListItem;
