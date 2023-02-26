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
import PurpieLogoAnimated from '../../../assets/purpie-logo/purpie-logo-animated';

const Contacts: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [isVisibleInvitationDrop, setVisibleInvitationDrop] = useState(false);

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
          <SelectedUser user={contacts.selected.user} />
        ) : (
          <Box pad="medium" gap="medium">
            {!contacts.loading && contacts.data.length > 0 && <SearchBar />}
            <InvitationList />
            <Divider />
            <InviteToPurpie
              isVisibleDrop={isVisibleInvitationDrop}
              setVisibleDrop={setVisibleInvitationDrop}
            />
            <Divider />
            <ContactsToFollow />
          </Box>
        )
      }
    >
      {contacts.loading && (
        <PurpieLogoAnimated width={50} height={50} color="brand" />
      )}
      {!contacts?.loading && contacts?.data?.length === 0 ? (
        <EmptyContact />
      ) : (
        <Box pad={{ vertical: 'medium' }} gap="medium">
          <Box direction="row" justify="between" align="center">
            <Text weight="bold">{t('common.contacts')}</Text>
            {searchContact()}
          </Box>
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
                onClick={selectContact}
              />
            )}
          </InfiniteScroll>
        </Box>
      )}
    </PrivatePageLayout>
  );
};

export default Contacts;
