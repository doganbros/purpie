import { Box, Text } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import GradientScroll from '../../../components/utils/GradientScroll';
import { listContactsAction } from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';
import PurpieLogoAnimated from '../../../assets/purpie-logo/purpie-logo-animated';
import { UserAvatar } from '../../../components/utils/Avatars/UserAvatar';
import EllipsesOverflowText from '../../../components/utils/EllipsesOverflowText';

const UserContacts: FC<{ userName: string }> = ({ userName }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    user: { contacts },
  } = useSelector((state: AppState) => state);
  const history = useHistory();

  useEffect(() => {
    dispatch(listContactsAction({ userName }));
  }, []);

  return (
    <Box gap="medium">
      <Text size="large" color="brand" weight="bold">
        {t('UserContacts.title')}
      </Text>
      <GradientScroll>
        <Box direction="row" gap="medium">
          {contacts.loading && (
            <PurpieLogoAnimated width={50} height={50} color="#9060EB" />
          )}
          {!contacts.loading && contacts.data.length === 0 ? (
            <Text size="small">{t('UserContacts.noContactsFound')}</Text>
          ) : (
            contacts.data.map((contact) => (
              <Box
                key={contact.id}
                gap="small"
                align="center"
                width={{ min: '102px' }}
                onClick={() =>
                  history.push(`/user/${contact.contactUser.userName}`)
                }
              >
                <UserAvatar
                  id={contact.id}
                  name={contact.contactUser.fullName}
                  src={contact.contactUser.displayPhoto}
                />
                <Box align="center">
                  <EllipsesOverflowText
                    textAlign="center"
                    size="small"
                    text={contact.contactUser.fullName}
                    weight="bold"
                  />
                  <EllipsesOverflowText
                    textAlign="center"
                    size="small"
                    text={`@${contact.contactUser.userName}`}
                    color="status-disabled"
                  />
                </Box>
              </Box>
            ))
          )}
        </Box>
      </GradientScroll>
    </Box>
  );
};

export default UserContacts;
