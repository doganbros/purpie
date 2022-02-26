import { Box, Button, TextArea } from 'grommet';
import React, { FC } from 'react';
import InitialsAvatar from '../../../../components/utils/InitialsAvatar';
import { User } from '../../../../store/types/auth.types';

interface InputProps {
  user: User;
}
const Input: FC<InputProps> = ({ user }) => {
  return (
    <Box direction="row" align="center" gap="small">
      {user && (
        <Box flex={{ shrink: 0 }}>
          <InitialsAvatar
            id={user.id}
            value={`${user?.firstName} ${user?.lastName}`}
          />
        </Box>
      )}
      <Box
        elevation="peach"
        fill
        round="small"
        direction="row"
        align="center"
        gap="small"
        pad={{ right: 'small' }}
      >
        <TextArea
          resize={false}
          plain
          focusIndicator={false}
          placeholder="Write a comment"
        />
        <Button label="Send" size="small" primary />
      </Box>
    </Box>
  );
};

export default Input;
