import { Box, Button, TextArea } from 'grommet';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { createPostCommentAction } from '../../../../store/actions/post.action';
import { User } from '../../../../store/types/auth.types';
import { UserAvatar } from '../../../../components/utils/Avatars/UserAvatar';

interface InputProps {
  user: User;
  postId: string;
}
const Input: FC<InputProps> = ({ user, postId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
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
          <UserAvatar
            id={user.id}
            name={user?.fullName}
            src={user?.displayPhoto}
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
          placeholder={t('CommentList.writeComment')}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button
          onClick={handleSend}
          label={t('common.send')}
          size="small"
          disabled={inputValue.length === 0}
          primary
        />
      </Box>
    </Box>
  );
};

export default Input;
