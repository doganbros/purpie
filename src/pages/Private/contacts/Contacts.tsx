import { Box, InfiniteScroll, Text } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import {
  listContactsAction,
  selectContactAction,
} from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { ContactUser } from '../../../store/types/user.types';
import SelectedUser from './SelectedUser';
import ContactListItem from './ContactListItem';

const Contacts: FC = () => {
  const dispatch = useDispatch();
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
      title="Contacts"
      rightComponent={
        contacts.selected.contactId && (
          <SelectedUser
            user={contacts.selected.user}
            contactId={contacts.selected.contactId}
          />
        )
      }
    >
      <Box pad={{ vertical: 'medium' }} gap="medium">
        <Text weight="bold">Contacts</Text>
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
      </Box>
    </PrivatePageLayout>
  );
};

export default Contacts;
