import { Box, Button, Text } from 'grommet';
import { t } from 'i18next';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { UserAvatar } from '../../../components/utils/Avatars/UserAvatar';
import { createContactInvitation } from '../../../store/actions/invitation.action';
import { User } from '../../../store/types/auth.types';

interface HeaderProps {
  user: User;
  currentUserId: string;
  handleShowRemoveDialog: () => void;
  isUserInvited: boolean;
}

const Header: FC<HeaderProps> = ({
  user,
  currentUserId,
  handleShowRemoveDialog,
  isUserInvited,
}) => {
  const dispatch = useDispatch();

  const AddOrRemoveButton = () => {
    if (currentUserId !== user.id) {
      if (user.isInContact)
        return (
          <Button
            primary
            color="red"
            label={t('ContactsToFollow.remove')}
            onClick={handleShowRemoveDialog}
          />
        );
      if (isUserInvited)
        return <Button plain disabled label={t('ContactsToFollow.invited')} />;
      return (
        <Button
          primary
          label={t('ContactsToFollow.add')}
          onClick={() => dispatch(createContactInvitation(user?.email))}
        />
      );
    }
    return null;
  };

  return (
    <Box direction="row" justify="between" align="center">
      <Box flex="grow" direction="row" align="center" gap="small">
        <UserAvatar
          id={user.id}
          name={user.fullName}
          src={user.displayPhoto}
          size="70px"
          textProps={{
            size: '25px',
          }}
        />
        <Box>
          <Text weight="bold">{user.fullName}</Text>
          <Text size="small" color="status-disabled">
            {user.userName}
          </Text>
        </Box>
      </Box>
      <AddOrRemoveButton />
    </Box>
  );
};

export default Header;
