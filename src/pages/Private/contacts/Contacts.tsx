import { Box, InfiniteScroll, Text, TextInput } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Search } from 'grommet-icons';
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
import ContactsToFollow from './ContactsToFollow';
import InviteToPurpie from './InviteToPurpie';

const Contacts: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
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

  const unSelectContact = () => {
    dispatch(
      selectContactAction({
        userName: '',
        contactId: 0,
      })
    );
  };

  const searchContact = () => {
    return (
      <Box
        width="medium"
        direction="row"
        align="center"
        border={{ color: 'light-4', size: 'small' }}
        round="medium"
        pad={{ horizontal: 'small' }}
      >
        <TextInput
          plain
          placeholder="Search in Contacts"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          focusIndicator={false}
        />

        <Search />
      </Box>
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
            <InviteToPurpie />
            <Divider />
            <ContactsToFollow />
          </Box>
        )
      }
    >
      <Box pad={{ vertical: 'medium' }} gap="medium">
        <Box direction="row" justify="between" align="center">
          <Text weight="bold">{t('common.contacts')}</Text>
          {searchContact()}
        </Box>
        {contacts.data.length > 0 ? (
          <InfiniteScroll
            items={contacts.data.filter(
              (contact) =>
                contact.contactUser.fullName.includes(search) ||
                contact.contactUser.userName.includes(search)
            )}
            step={6}
            onMore={() => {
              getContacts(contacts.data.length);
            }}
          >
            {(item: ContactUser) => (
              <ContactListItem
                selected={contacts.selected.contactId === item.id}
                contact={item}
                onClick={
                  contacts.selected.contactId ? unSelectContact : selectContact
                }
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
