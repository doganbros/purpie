import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { UserBasic } from '../../../store/types/auth.types';
import InitialsAvatar from '../../utils/InitialsAvatar';

interface Props {
  user: UserBasic;
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
        <InitialsAvatar size="small" id={user.id} value={user.fullName} />
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
