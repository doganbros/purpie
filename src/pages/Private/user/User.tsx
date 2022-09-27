import { Box, Grid, Layer, Spinner, Text } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import PostListItem from '../../../components/post/PostListItem';
import Divider from '../../../components/utils/Divider';
import GradientScroll from '../../../components/utils/GradientScroll';
import {
  createPostSaveAction,
  removePostSaveAction,
} from '../../../store/actions/post.action';
import {
  getUserDetailAction,
  listUserPublicChannelsAction,
} from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';
import Header from './Header';
import { userData } from './mock-data';
import { UserSummary } from './UserSummary';
import UserFriends from './UserFriends';
import UserPublicChannels from './UserPublicChannels';
import UserPublicZones from './UserPublicZones';

interface UserParams {
  userName: string;
}

const User: FC = () => {
  const params = useParams<UserParams>();
  const dispatch = useDispatch();
  const {
    user: { detail },
  } = useSelector((state: AppState) => state);
  const history = useHistory();

  useEffect(() => {
    dispatch(getUserDetailAction(params));
    dispatch(listUserPublicChannelsAction(params.userName));
  }, []);

  return (
    <PrivatePageLayout
      title={detail.user ? detail.user.fullName : 'Loading'}
      topComponent={detail.user && <Header user={detail.user} />}
      rightComponent={
        detail.user && (
          <Box pad="medium" gap="medium">
            <UserSummary
              id={detail.user.id}
              userName={detail.user.userName}
              fullName={detail.user.fullName}
              email={detail.user.email}
            />
          </Box>
        )
      }
    >
      {detail.loading || !detail.user ? (
        <Layer responsive={false} plain>
          <Spinner />
        </Layer>
      ) : (
        <Box gap="medium" pad={{ vertical: 'medium' }}>
          <PostListItem
            post={userData.featuredPost}
            onClickPlay={() => {}}
            onClickSave={() => {}}
          />
          <Divider />
          <UserFriends userName={params.userName} />
          <Divider />
          <UserPublicChannels userName={params.userName} />
          <UserPublicZones userName={params.userName} />
          <Text size="large" color="brand" weight="bold">
            Shared Lists
          </Text>
          {userData.sharedLists.map((list) => (
            <Box key={list.id} gap="medium">
              <Box>
                <Text weight="bold" size="large">
                  {list.name}
                </Text>
                <Text>
                  {list.posts.length} {list.posts.length < 2 ? 'post' : 'posts'}
                </Text>
              </Box>
              <GradientScroll>
                <Grid
                  columns={{ count: list.posts.length, size: 'large' }}
                  gap="small"
                >
                  {list.posts.map((p) => (
                    <PostListItem
                      key={p.id}
                      post={p}
                      onClickPlay={() => history.push(`video/${p.id}`)}
                      onClickSave={() => {
                        if (p.saved)
                          dispatch(removePostSaveAction({ postId: p.id }));
                        else dispatch(createPostSaveAction({ postId: p.id }));
                      }}
                    />
                  ))}
                </Grid>
              </GradientScroll>
            </Box>
          ))}
        </Box>
      )}
    </PrivatePageLayout>
  );
};

export default User;
