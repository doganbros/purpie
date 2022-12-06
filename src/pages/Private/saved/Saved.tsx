import React, { FC, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Box, Button, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import SearchBar from '../../../components/utils/SearchBar';
import { removePostSaveAction } from '../../../store/actions/post.action';
import { AppState } from '../../../store/reducers/root.reducer';
import ChannelsToFollow from '../timeline/ChannelsToFollow';
import LastActivities from '../timeline/LastActivities';
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
  // const size = useContext(ResponsiveContext);
  // const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
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
          <LastActivities />
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
          <PurpieLogoAnimated width={100} height={100} color="#956aea" />
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
            onConfirm={() => {
              if (confirmation.postId !== null) {
                dispatch(removePostSaveAction({ postId: confirmation.postId }));
              }
            }}
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
