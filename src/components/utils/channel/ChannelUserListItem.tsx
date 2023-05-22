import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { useHistory } from 'react-router-dom';
import EllipsesOverflowText from '../EllipsesOverflowText';
import { UserAvatar } from '../Avatars/UserAvatar';

interface ChannelUserListItemProps {
  id: string;
  name: string;
  userName: string;
  displayPhoto?: string;
  channelRole?: string;
}

const ChannelUserListItem: FC<ChannelUserListItemProps> = ({
  id,
  name,
  userName,
  displayPhoto,
  channelRole,
}) => {
  const history = useHistory();

  return (
    <Box
      direction="row"
      align="center"
      gap="small"
      onClick={() => history.push(`/user/${userName}`)}
      focusIndicator={false}
    >
      <UserAvatar id={id} name={name} src={displayPhoto} />
      <Box>
        <EllipsesOverflowText
          maxWidth="212px"
          lineClamp={1}
          size="small"
          weight="bold"
          text={name}
        />
        <Text size="xsmall" color="status-disabled">
          {userName} {channelRole && `(${channelRole})`}
        </Text>
      </Box>
    </Box>
  );
};

export default ChannelUserListItem;
