import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { useSelector } from 'react-redux';
import { UserAvatar } from '../../../components/utils/Avatars/UserAvatar';
import { User } from '../../../store/types/auth.types';
import { AppState } from '../../../store/reducers/root.reducer';

interface Props {
  user: User | null;
  typingUsers: User[];
}

const SelectedUserHead: FC<Props> = ({ user, typingUsers }) => {
  const {
    chat: { usersOnline },
  } = useSelector((state: AppState) => state);

  if (user) {
    const userOnline = usersOnline.includes(user.id);
    return (
      <Box direction="row" gap="xsmall" align="center">
        <UserAvatar
          online={userOnline}
          id={user.id}
          name={user.fullName}
          src={user.displayPhoto}
        />
        <Box>
          <Text size="small" weight={500} color="dark">
            {user.fullName}
          </Text>
          {typingUsers.map((u) => u.id).includes(user.id) ? (
            <Text size="10px" weight={400} color="brand-alt">
              Typing...
            </Text>
          ) : (
            <Text size="10px" weight={400} color="status-disabled">
              {userOnline ? 'Online' : 'Offline'}
            </Text>
          )}
        </Box>
      </Box>
    );
  }
  return null;
};

export default SelectedUserHead;
