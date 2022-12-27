import React, { FC, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Box, Button, Text } from 'grommet';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import SearchBar from '../../../components/utils/SearchBar';
import { AppState } from '../../../store/reducers/root.reducer';
import ChannelsToFollow from '../timeline/ChannelsToFollow';
import Notifications from '../timeline/Notifications';
import ZonesToJoin from '../timeline/ZonesToJoin';
import ConfirmDialog from '../../../components/utils/ConfirmDialog';
import SavedVideo from '../../../layers/saved-video/SavedVideo';
import { CreateFolderDrop } from '../../../layers/saved-video/folder/CreateFolderDrop';
import PurpieLogoAnimated from '../../../assets/purpie-logo/purpie-logo-animated';

dayjs.extend(relativeTime);

interface ConfirmationState {
  visible: boolean;
  postId: null | number;
}

const Saved: FC = () => {
  const { t } = useTranslation();
  const {
    folder: { folderList },
  } = useSelector((state: AppState) => state);

  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    visible: false,
    postId: null,
  });

  const closeConfirmation = () => {
    setConfirmation({ visible: false, postId: null });
  };

  return (
    <PrivatePageLayout
      title={t('Saved.title')}
      rightComponent={
        <Box pad="medium" gap="medium">
          <SearchBar />
          <ChannelsToFollow />
          <Divider />
          <ZonesToJoin />
          <Notifications />
        </Box>
      }
    >
      <Box pad={{ vertical: 'large' }} gap="large">
        <Box direction="row" justify="between" align="center">
          <Text weight="bold" color="brand-alt">
            {t('Saved.title')}
          </Text>
          <CreateFolderDrop
            dropLabel={
              <Button size="small" primary label="Create New Folder" />
            }
          />
        </Box>
        {folderList.loading && (
          <PurpieLogoAnimated width={100} height={100} color="brand" />
        )}
        {!folderList.loading && folderList.data.length === 0 ? (
          <Text size="small">No post folder found!</Text>
        ) : (
          <Box gap="large">
            {folderList.data.map((folder) => (
              <SavedVideo key={`folder-item-${folder.id}`} folder={folder} />
            ))}
          </Box>
        )}
        {confirmation.visible && (
          <ConfirmDialog
            onConfirm={() => 'remove post from folder'}
            onDismiss={closeConfirmation}
            message={t('Saved.removeConfirmMsg')}
            confirmButtonText={t('common.remove')}
          />
        )}
      </Box>
    </PrivatePageLayout>
  );
};

export default Saved;
