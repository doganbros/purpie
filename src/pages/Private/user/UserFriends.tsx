import { Box, Text } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import GradientScroll from '../../../components/utils/GradientScroll';
import { listContactsAction } from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';
import PurpieLogoAnimated from '../../../assets/purpie-logo/purpie-logo-animated';
import { UserAvatar } from '../../../components/utils/Avatars/UserAvatar';

const UserFriends: FC<{ userName: string }> = ({ userName }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    user: { contacts },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    dispatch(listContactsAction({ userName }));
  }, []);

  return (
    <Box gap="medium">
      <Text size="large" color="brand" weight="bold">
        {t('UserFriends.title')}
      </Text>
      <GradientScroll>
        <Box direction="row" gap="medium">
          {contacts.loading && (
            <PurpieLogoAnimated width={50} height={50} color="#956aea" />
          )}
          {!contacts.loading && contacts.data.length === 0 ? (
            <Text size="small">{t('UserFriends.noFriendsFound')}</Text>
          ) : (
            contacts.data.map((contact) => (
              <Box key={contact.id} gap="small" align="center">
                <UserAvatar
                  id={contact.id}
                  name={contact.contactUser.fullName}
                />
                <Box align="center">
                  <Text size="small" weight="bold">
                    {contact.contactUser.fullName}
                  </Text>
                  <Text size="small" color="status-disabled">
                    @{contact.contactUser.userName}
                  </Text>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </GradientScroll>
    </Box>
  );
};

export default UserFriends;
