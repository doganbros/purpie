import React, { FC, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, InfiniteScroll, ResponsiveContext, Text } from 'grommet';
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

const Saved: FC = () => {
  const size = useContext(ResponsiveContext);
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    post: { saved },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    dispatch(
      getSavedPostAction({
        limit: 30,
        skip: 0,
      })
    );
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
            <InfiniteScroll items={saved.data} step={6}>
              {({ post }: typeof saved.data[0]) => (
                <PostGridItem
                  key={post.slug}
                  slug={post.slug}
                  id={post.id}
                  comments={post.commentsCount}
                  createdAt={dayjs(post.createdOn).fromNow()}
                  likes={post.likesCount}
                  live={post.liveStream}
                  onClickPlay={() => history.push(`video/${post.id}`)}
                  onClickSave={() => {
                    dispatch(removePostSaveAction({ postId: post.id }));
                  }}
                  saved
                  createdBy={post.createdBy}
                  videoTitle={post.title}
                  videoName={post.videoName}
                />
              )}
            </InfiniteScroll>
          )}
        </Grid>
      </Box>
    </PrivatePageLayout>
  );
};

export default Saved;