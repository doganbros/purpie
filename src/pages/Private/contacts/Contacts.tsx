import { Box, InfiniteScroll, Text } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import {
  listContactsAction,
  selectContactAction,
} from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { ContactUser } from '../../../store/types/user.types';
import SelectedUser from './SelectedUser';
import ContactListItem from './ContactListItem';
import SearchBar from '../../../components/utils/SearchBar';
import InvitationList from '../timeline/InvitationList';
import Divider from '../../../components/utils/Divider';
import EmptyContact from './EmptyContact';
import InviteContact from './InviteContact';
import ContactsToFollow from './ContactsToFollow';

const Contacts: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    user: { contacts },
  } = useSelector((state: AppState) => state);

  const getContacts = (skip?: number) => {
    dispatch(listContactsAction({ skip }));
  };

  const selectContact = (contact: ContactUser) => {
    dispatch(
      selectContactAction({
        userName: contact.contactUser.userName,
        contactId: contact.id,
      })
    );
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <PrivatePageLayout
      title={t('common.contacts')}
      rightComponent={
        contacts.selected.contactId ? (
          <SelectedUser
            user={contacts.selected.user}
            contactId={contacts.selected.contactId}
          />
        ) : (
          <Box pad="medium" gap="medium">
            <SearchBar />
            <InvitationList />
            <Divider />
            <InviteContact />
            <Divider />
            <ContactsToFollow />
          </Box>
        )
      }
    >
      <Box pad={{ vertical: 'medium' }} gap="medium">
        <Text weight="bold">{t('common.contacts')}</Text>
        {contacts.data.length > 0 ? (
          <InfiniteScroll
            items={contacts.data}
            step={6}
            onMore={() => {
              getContacts(contacts.data.length);
            }}
          >
            {(item: ContactUser) => (
              <ContactListItem
                selected={contacts.selected.contactId === item.id}
                contact={item}
                onClick={selectContact}
              />
            )}
          </InfiniteScroll>
        ) : (
          <EmptyContact onFindContact={() => console.log('sdf')} />
        )}
      </Box>
    </PrivatePageLayout>
  );
};

export default Contacts;
