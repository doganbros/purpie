import React, { FC, useEffect } from 'react';
import { Box, Button, Text } from 'grommet';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import { getContactSuggestionsAction } from '../../../store/actions/activity.action';
import { UserAvatar } from '../../../components/utils/Avatars/UserAvatar';
import { createContactInvitation } from '../../../store/actions/invitation.action';

const ContactsToFollow: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    activity: {
      contactSuggestions: { data, loading },
    },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    dispatch(getContactSuggestionsAction());
  }, []);

  return (
    <Box gap="small">
      <Text size="small" weight={500} color="dark">
        {t('ContactsToFollow.title')}
      </Text>
      {loading && <Text size="small">{t('common.loading')}</Text>}
      {!loading &&
        (data.length === 0 ? (
          <Text size="small">{t('ContactsToFollow.noContactsFound')}</Text>
        ) : (
          data.map((user) => (
            <Box
              direction="row"
              justify="between"
              align="center"
              key={`contactsToFollow-${user.userId}`}
            >
              <Box direction="row" align="center" gap="small">
                <UserAvatar
                  id={user.userId}
                  name={user.fullName}
                  src={user.displayPhoto}
                />
                <Box>
                  <Text size="small" weight={500} color="dark">
                    {user.fullName}
                  </Text>
                  <Text size="xsmall" color="status-disabled">
                    {user.userName}
                  </Text>
                </Box>
              </Box>
              <Button
                primary
                onClick={() => {
                  dispatch(createContactInvitation(user.email));
                }}
                label={t('ContactsToFollow.add')}
                size="small"
              />
            </Box>
          ))
        ))}
    </Box>
  );
};

export default ContactsToFollow;
