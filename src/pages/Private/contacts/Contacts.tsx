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
import useDelayTime from '../../../hooks/useDelayTime';
import { DELAY_TIME } from '../../../helpers/constants';
import { getContactSuggestionsAction } from '../../../store/actions/activity.action';

const Contacts: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [isVisibleInvitationDrop, setVisibleInvitationDrop] = useState(false);

  const {
    user: { contacts },
    invitation: { invitations },
  } = useSelector((state: AppState) => state);

  const getContacts = (skip?: number) => {
    dispatch(listContactsAction({ skip }));
  };
  const { delay } = useDelayTime(DELAY_TIME);

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
  const getSideComponentsLoadingState = () => {
    return invitations.loading || contacts.loading || delay;
  };
  const renderSideBar = () => {
    if (contacts.selected.contactId) {
      return <SelectedUser user={contacts.selected.user} />;
    }
    if (getSideComponentsLoadingState()) {
      return (
        <Box width="100%" height="100vh" justify="center" align="center">
          <PurpieLogoAnimated width={100} height={100} color="#9060EB" />
        </Box>
      );
    }

    return (
      <Box pad="medium" gap="medium">
        {!contacts.loading && contacts.data.length > 0 && <SearchBar />}
        <InvitationList />
        {!invitations.loading && invitations.data.length !== 0 && <Divider />}
        <InviteToPurpie
          isVisibleDrop={isVisibleInvitationDrop}
          setVisibleDrop={setVisibleInvitationDrop}
        />
        <ContactsToFollow />
      </Box>
    );
  };

  useEffect(() => {
    getContacts();
    dispatch(getContactSuggestionsAction());
  }, []);

  return (
    <PrivatePageLayout
      title={t('common.contacts')}
      rightComponent={renderSideBar()}
    >
      {contacts.loading && (
        <PurpieLogoAnimated width={50} height={50} color="#9060EB" />
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
