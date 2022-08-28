import { Box, Button, Spinner } from 'grommet';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import ConfirmDialog from '../../../components/utils/ConfirmDialog';
import { removeContactAction } from '../../../store/actions/user.action';
import { User } from '../../../store/types/auth.types';
import { UserSummary } from '../user/UserSummary';

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
        <UserSummary
          id={user.id}
          userName={user.userName}
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
        />
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
