import { Box, InfiniteScroll, Text } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import {
  listContactsAction,
  selectContactAction,
} from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';
import SelectedUser from './ContactDetail';
import ContactListItem from './ContactListItem';

const Contacts: FC = () => {
  const dispatch = useDispatch();
  const {
    user: { contacts },
  } = useSelector((state: AppState) => state);
  const [activeContact, setActiveContact] = useState<string | null>(null);

  const getContacts = (skip?: number) => {
    dispatch(listContactsAction({ skip }));
  };

  const selectContact = (userName: string) => {
    setActiveContact(userName);
    dispatch(selectContactAction(userName));
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <PrivatePageLayout
      title="Contacts"
      rightComponent={
        activeContact && <SelectedUser user={contacts.selected.user} />
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
          {(item: typeof contacts.data[0]) => (
            <ContactListItem
              selected={activeContact === item.contactUser.userName}
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
