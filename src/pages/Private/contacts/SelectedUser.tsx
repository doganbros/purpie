import { Box, Button } from 'grommet';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ConfirmDialog from '../../../components/utils/ConfirmDialog';
import { removeContactAction } from '../../../store/actions/user.action';
import { User } from '../../../store/types/auth.types';
import { UserSummary } from '../user/UserSummary';
import Loader from '../../../components/utils/Loader';

interface SelectedUserProps {
  user: User | null;
  contactId?: number;
}

const SelectedUser: FC<SelectedUserProps> = ({ user, contactId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  return !user ? (
    <Box pad="large" justify="center" align="center">
      <Loader />
    </Box>
  ) : (
    <>
      <Box pad="medium" gap="medium">
        <UserSummary
          id={user.id}
          userName={user.userName}
          fullName={user.fullName}
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
              label={t('SelectedUser.removeContact')}
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
                confirmButtonText={t('common.remove')}
                message={t('SelectedUser.removeConfirmMsg', {
                  fullName: user.fullName,
                })}
              />
            )}
          </>
        )}
      </Box>
    </>
  );
};

export default SelectedUser;
