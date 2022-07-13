import { Box, Button, Spinner, Text } from 'grommet';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import ConfirmDialog from '../../../components/utils/ConfirmDialog';
import Divider from '../../../components/utils/Divider';
import InitialsAvatar from '../../../components/utils/InitialsAvatar';
import { removeContactAction } from '../../../store/actions/user.action';
import { User } from '../../../store/types/auth.types';

interface SelectedUserProps {
  user: User | null;
  contactId?: number;
}

const SelectedUser: FC<SelectedUserProps> = ({ user, contactId }) => {
  const dispatch = useDispatch();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  return !user ? (
    <Box pad="large" justify="center" align="center">
      <Spinner />
    </Box>
  ) : (
    <>
      <Box pad="medium" gap="medium">
        <InitialsAvatar
          value={`${user.firstName} ${user.lastName}`}
          id={user.id}
          size="355px"
          round="medium"
          textProps={{ size: '120px' }}
        />
        <Text weight="bold" size="large" alignSelf="end">
          {user.firstName} {user.lastName}
        </Text>
        <Divider />
        <Box align="end" gap="small">
          <Text weight="bold">User Name</Text>
          <Text color="status-disabled">{user.userName}</Text>
          <Text weight="bold">Email</Text>
          <Text color="status-disabled">{user.email}</Text>
        </Box>
        {contactId && (
          <>
            <Button
              primary
              onClick={() => setShowRemoveDialog(true)}
              color="status-error"
              alignSelf="center"
              margin={{ vertical: 'medium' }}
              label="Remove from Contacts"
            />
            {showRemoveDialog && (
              <ConfirmDialog
                onDismiss={() => {
                  setShowRemoveDialog(false);
                }}
                onConfirm={() => {
                  setShowRemoveDialog(false);
                  dispatch(removeContactAction(contactId));
                }}
                confirmButtonText="Remove"
                message={`Are you sure you want to remove ${user.firstName} ${user.lastName} from you contacts?`}
              />
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default SelectedUser;
