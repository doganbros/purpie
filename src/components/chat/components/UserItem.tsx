import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { User } from '../../../store/types/auth.types';
import { UserAvatar } from '../../utils/Avatars/UserAvatar';

interface Props {
  user: User;
  onClick: () => void;
}

const UserItem: FC<Props> = ({ user, onClick }) => {
  return (
    <Box
      onClick={onClick}
      direction="row"
      align="center"
      gap="small"
      round="small"
      key={user.id}
      focusIndicator={false}
      hoverIndicator={{ background: 'rgba(0,0,0,0.1)' }}
      pad={{ vertical: 'xsmall', horizontal: 'small' }}
    >
      <Box flex={{ shrink: 0 }}>
        <UserAvatar
          size="small"
          id={user.id}
          name={user.fullName}
          src={user.displayPhoto}
        />
      </Box>
      <Box>
        <Text
          color="brand"
          weight="bold"
          size="small"
          style={{ userSelect: 'none' }}
        >
          {user.fullName}
        </Text>
        <Text
          color="status-disabled"
          size="xsmall"
          style={{ userSelect: 'none' }}
        >
          {user.userName}
        </Text>
      </Box>
    </Box>
  );
};

export default UserItem;
