import React, { FC, useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Box,
  Button,
  Grid,
  InfiniteScroll,
  ResponsiveContext,
  Text,
} from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import PostGridItem from '../../../components/post/PostGridItem';
import SearchBar from '../../../components/utils/SearchBar';
import {
  getSavedPostAction,
  removePostSaveAction,
} from '../../../store/actions/post.action';
import { AppState } from '../../../store/reducers/root.reducer';
import ChannelsToFollow from '../timeline/ChannelsToFollow';
import LastActivities from '../timeline/LastActivities';
import ZonesToJoin from '../timeline/ZonesToJoin';
import ConfirmDialog from '../../../components/utils/ConfirmDialog';
import SavedVideo from '../../../layers/saved-video/SavedVideo';
import { CreateFolderDrop } from '../../../layers/saved-video/folder/CreateFolderDrop';

dayjs.extend(relativeTime);

interface ConfirmationState {
  visible: boolean;
  postId: null | number;
}

const Saved: FC = () => {
  const size = useContext(ResponsiveContext);
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    post: { saved },
  } = useSelector((state: AppState) => state);

  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    visible: false,
    postId: null,
  });

  const closeConfirmation = () => {
    setConfirmation({ visible: false, postId: null });
  };

  const getSaved = (skip?: number) => {
    dispatch(
      getSavedPostAction({
        skip,
      })
    );
  };

  useEffect(() => {
    getSaved();
  }, []);

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
      <Box pad={{ vertical: 'large' }} gap="medium">
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
        <Grid
          columns={size !== 'small' ? 'medium' : '100%'}
          gap={{ row: 'large', column: 'medium' }}
        >
          {saved.data.length === 0 ? (
            <Text size="small" color="status-disabled">
              {t('Saved.emptyMsg')}
            </Text>
          ) : (
            <InfiniteScroll
              items={saved.data}
              onMore={() => {
                getSaved(saved.data.length);
              }}
              step={6}
            >
              {({ post }: typeof saved.data[0]) => (
                <PostGridItem
                  key={post.id}
                  post={{ ...post, saved: true }}
                  onClickPlay={() => history.push(`video/${post.id}`)}
                  onClickSave={() => {
                    setConfirmation({ visible: true, postId: post.id });
                  }}
                />
              )}
            </InfiniteScroll>
          )}
        </Grid>
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
      <Box gap="xlarge">
        <SavedVideo text="UX Design" numberOfVideos={3} />
        <SavedVideo text="Development" numberOfVideos={50} />
        <SavedVideo text="Financial" numberOfVideos={4} />
      </Box>
    </PrivatePageLayout>
  );
};

export default Saved;
