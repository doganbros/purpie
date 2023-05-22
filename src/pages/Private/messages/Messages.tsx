import React, { FC, useEffect, useState } from 'react';
import { Box } from 'grommet';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import { AppState } from '../../../store/reducers/root.reducer';
import Divider from '../../../components/utils/Divider';
import Chat, {
  ChatInfo,
  updateUnreadMessageCount,
} from '../../../components/chat/Chat';
import MessageContactList from './MessageContactList';
import { User } from '../../../store/types/auth.types';
import SelectedUserHead from './SelectedUserHead';
import { getUnreadMessageCounts } from '../../../store/services/chat.service';

const Messages: FC = () => {
  const { t } = useTranslation();
  const {
    post: {
      postDetail: { data },
    },
  } = useSelector((state: AppState) => state);

  const [chatInfo, setChatInfo] = useState<ChatInfo>({
    typingUsers: [],
    unreadMessageCounts: [],
  });
  const [selectedContact, setSelectedContact] = useState<User | null>(null);

  useEffect(() => {
    getUnreadMessageCounts().then((res) =>
      setChatInfo({ ...chatInfo, unreadMessageCounts: res })
    );
  }, []);

  return (
    <PrivatePageLayout
      title={data?.title || t('common.loading')}
      topComponent={
        <SelectedUserHead
          user={selectedContact}
          typingUsers={chatInfo.typingUsers}
        />
      }
      rightComponent={
        <Box pad="medium" gap="medium">
          <Box>Search Conversation Input</Box>
          <Divider />
          <MessageContactList
            chatInfo={chatInfo}
            selectedContact={selectedContact}
            setSelectedContact={(val) => {
              setSelectedContact(val);
              updateUnreadMessageCount(chatInfo, val.id, 0);
            }}
          />
        </Box>
      }
    >
      {selectedContact && (
        <Chat
          medium="direct"
          id={selectedContact.id}
          handleTypingEvent
          canAddFile
          chatInfo={chatInfo}
          setChatInfo={setChatInfo}
        />
      )}
    </PrivatePageLayout>
  );
};

export default Messages;
