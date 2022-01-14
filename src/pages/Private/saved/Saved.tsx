import React, { FC, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Grid,
  InfiniteScroll,
  Layer,
  ResponsiveContext,
  Text,
} from 'grommet';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import ChannelsToFollow from '../timeline/ChannelsToFollow';
import ZonesToJoin from '../timeline/ZonesToJoin';
import LastActivities from '../timeline/LastActivities';
import Searchbar from '../timeline/Searchbar';
import PostGridItem from '../../../components/utils/PostGridItem/PostGridItem';
import ChannelList from '../timeline/ChannelList';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  getSavedPostAction,
  removePostSaveAction,
} from '../../../store/actions/post.action';

dayjs.extend(relativeTime);

interface ConfirmationState {
  visible: boolean;
  postId: null | number;
}

const Saved: FC = () => {
  const size = useContext(ResponsiveContext);
  const history = useHistory();
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
      title="Saved Posts"
      rightComponent={
        <Box pad="medium" gap="medium">
          <Searchbar />
          <ChannelsToFollow />
          <Divider />
          <ZonesToJoin />
          <LastActivities />
        </Box>
      }
      topComponent={<ChannelList />}
    >
      <Box pad={{ vertical: 'medium' }} gap="medium">
        <Box direction="row" justify="between" align="center">
          <Text weight="bold">Saved Posts</Text>
        </Box>
        <Grid
          columns={size !== 'small' ? 'medium' : '100%'}
          gap={{ row: 'large', column: 'medium' }}
        >
          {saved.data.length === 0 ? (
            <Text size="small" color="status-disabled">
              Your saved posts will appear here
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
                  post={post}
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
          <Layer responsive={false} onClickOutside={closeConfirmation}>
            <Box pad="large" gap="medium" width="350px">
              <Text weight="bold">
                Are you sure you want to remove this post from your saved list?
              </Text>
              <Box fill="horizontal" direction="row" justify="between">
                <Button
                  primary
                  color="status-error"
                  onClick={() => {
                    if (confirmation.postId !== null) {
                      dispatch(
                        removePostSaveAction({ postId: confirmation.postId })
                      );
                      closeConfirmation();
                    }
                  }}
                  label="Remove"
                />
                <Button
                  primary
                  color="brand"
                  onClick={closeConfirmation}
                  label="Cancel"
                />
              </Box>
            </Box>
          </Layer>
        )}
      </Box>
    </PrivatePageLayout>
  );
};

export default Saved;
