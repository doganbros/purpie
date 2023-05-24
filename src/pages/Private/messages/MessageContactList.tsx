import React, { FC, useEffect } from 'react';
import { Box, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { listContactsAction } from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { UserAvatar } from '../../../components/utils/Avatars/UserAvatar';
import { User } from '../../../store/types/auth.types';
import { ChatInfo } from '../../../components/chat/Chat';

interface Props {
  chatInfo: ChatInfo;
  selectedContact: User | null;
  setSelectedContact: (contact: User) => void;
  searchText: string;
}

const MessageContactList: FC<Props> = ({
  chatInfo: { typingUsers, unreadMessageCounts },
  selectedContact,
  setSelectedContact,
  searchText,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    user: { contacts },
    chat: { usersOnline },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    getContacts();
  }, []);

  useEffect(() => {
    if (contacts.data.length > 0 && !selectedContact)
      setSelectedContact(contacts.data[0].contactUser);
  }, [contacts]);

  const getContacts = (skip?: number) => {
    dispatch(listContactsAction({ skip }));
  };

  const parseDateToString = (date: Date) => {
    const diff = dayjs().startOf('day').diff(dayjs(date).startOf('day'), 'day');
    if (diff === 0) return dayjs(date).format('HH:mm');

    if (diff === 1) return t('Chat.yesterday');

    return dayjs(date).format('MM.DD.YYYY');
  };

  return (
    <Box gap="small">
      <Text size="medium" weight={500} color="dark">
        Conversations
      </Text>
      {contacts.data
        .filter(
          (contact) =>
            contact.contactUser.fullName.includes(searchText) ||
            contact.contactUser.userName.includes(searchText)
        )
        .map(({ contactUser, lastOnlineDate }) => {
          const userOnline = usersOnline.includes(contactUser.id);
          const unreadMessageCount = unreadMessageCounts.find(
            (c) => c.userId === contactUser.id
          );
          return (
            <Box
              onClick={() => setSelectedContact(contactUser)}
              background={
                selectedContact && selectedContact.id === contactUser.id
                  ? 'status-disabled-light'
                  : 'white'
              }
              direction="row"
              pad="small"
              round="xsmall"
              key={contactUser.id}
              justify="between"
              align="center"
            >
              <Box direction="row" gap="xsmall" align="center">
                <UserAvatar
                  online={userOnline}
                  id={contactUser.id}
                  name={contactUser.fullName}
                  src={contactUser.displayPhoto}
                />
                <Box>
                  <Text size="small" weight={500} color="dark">
                    {contactUser.fullName}
                  </Text>
                  {typingUsers.map((u) => u.id).includes(contactUser.id) ? (
                    <Text size="10px" weight={400} color="brand-alt">
                      Typing...
                    </Text>
                  ) : (
                    <Text size="10px" weight={400} color="status-disabled">
                      {userOnline ? 'Online' : 'Offline'}
                    </Text>
                  )}
                </Box>
              </Box>
              {unreadMessageCount && unreadMessageCount.count > 0 ? (
                <Box
                  round
                  background="brand-alt"
                  pad="small"
                  width="32px"
                  height="32px"
                  justify="center"
                  align="center"
                >
                  <Text size="small" weight="bold">
                    {unreadMessageCount.count}
                  </Text>
                </Box>
              ) : (
                <Text size="10px" weight={400} color="status-disabled">
                  {parseDateToString(lastOnlineDate)}
                </Text>
              )}
            </Box>
          );
        })}
    </Box>
  );
};

export default MessageContactList;
