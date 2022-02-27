import { Box, Button, TextArea } from 'grommet';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import InitialsAvatar from '../../../../components/utils/InitialsAvatar';
import { createPostCommentAction } from '../../../../store/actions/post.action';
import { User } from '../../../../store/types/auth.types';

interface InputProps {
  user: User;
  postId: number;
}
const Input: FC<InputProps> = ({ user, postId }) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue) {
      dispatch(createPostCommentAction(inputValue, postId));
      setInputValue('');
    }
  };

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
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button onClick={handleSend} label="Send" size="small" primary />
      </Box>
    </Box>
  );
};

export default Input;
