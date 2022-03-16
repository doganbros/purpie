import React, { FC, useEffect, useState } from 'react';
import { Box, InfiniteScroll, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import InitialsAvatar from '../../../components/utils/InitialsAvatar';
import { listContactsAction } from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';
import ContactDetail from './ContactDetail';
import { theme } from '../../../config/app-config';

const Contacts: FC = () => {
  const dispatch = useDispatch();
  const {
    user: { contacts },
  } = useSelector((state: AppState) => state);
  const [activeContact, setActiveContact] = useState<number | null>(null);

  const getContacts = (skip?: number) => {
    dispatch(listContactsAction({ skip }));
  };

  useEffect(() => {
    getContacts();
  }, []);

  return (
    <PrivatePageLayout
      title="Contacts"
      rightComponent={activeContact && <ContactDetail />}
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
            <Box
              onClick={() => {
                setActiveContact(item.contactUser.id);
              }}
              background={activeContact === item.contactUser.id ? 'brand' : ''}
              focusIndicator={false}
              direction="row"
              justify="between"
              align="center"
              round="small"
              width={{
                width:
                  activeContact === item.contactUser.id
                    ? `calc(100% + 2*${theme.global?.edgeSize?.medium})`
                    : 'auto',
                max:
                  activeContact === item.contactUser.id
                    ? `calc(100% + 2*${theme.global?.edgeSize?.medium})`
                    : 'auto',
              }}
              pad={{
                vertical: 'small',
                horizontal:
                  activeContact === item.contactUser.id ? 'medium' : '',
              }}
              margin={{
                horizontal:
                  activeContact === item.contactUser.id
                    ? `-${theme.global?.edgeSize?.medium}`
                    : '',
              }}
            >
              <Box direction="row" align="center" gap="small">
                <InitialsAvatar
                  id={item.id}
                  value={`${item.contactUser.firstName} ${item.contactUser.lastName}`}
                />
                <Text
                  weight="bold"
                  color={
                    activeContact === item.contactUser.id ? 'white' : 'brand'
                  }
                >
                  {item.contactUser.firstName} {item.contactUser.lastName}
                </Text>
                <Text
                  color={
                    activeContact === item.contactUser.id
                      ? 'status-disabled-light'
                      : 'status-disabled'
                  }
                >
                  @{item.contactUser.userName}USERNAME_MISSING
                </Text>
              </Box>
              <Text
                color={
                  activeContact === item.contactUser.id ? 'accent-3' : 'blue'
                }
              >
                View full profile
              </Text>
            </Box>
          )}
        </InfiniteScroll>
      </Box>
    </PrivatePageLayout>
  );
};

export default Contacts;
