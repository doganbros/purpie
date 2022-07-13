import { Box, Grid, Layer, Spinner, Text } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import PostListItem from '../../../components/post/PostListItem';
import Divider from '../../../components/utils/Divider';
import GradientScroll from '../../../components/utils/GradientScroll';
import InitialsAvatar from '../../../components/utils/InitialsAvatar';
import { getUserDetailAction } from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';
import Header from './Header';
import { userData } from './mock-data';
import { UserSummary } from './UserSummary';

interface UserParams {
  userName: string;
}

const User: FC = () => {
  const params = useParams<UserParams>();
  const dispatch = useDispatch();
  const {
    user: { detail },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    dispatch(getUserDetailAction(params));
  }, []);

  return (
    <PrivatePageLayout
      title={
        detail.user
          ? `${detail.user.firstName} ${detail.user.lastName}`
          : 'Loading'
      }
      topComponent={detail.user && <Header user={detail.user} />}
      rightComponent={
        detail.user && (
          <Box pad="medium" gap="medium">
            <UserSummary
              id={detail.user.id}
              userName={detail.user.userName}
              firstName={detail.user.firstName}
              lastName={detail.user.lastName}
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
          <Text size="large" color="brand" weight="bold">
            Friends
          </Text>
          <GradientScroll>
            <Box direction="row" gap="medium">
              {userData.friends.map((f) => (
                <Box key={f.id} gap="small" align="center">
                  <InitialsAvatar
                    id={f.id}
                    value={`${f.firstName} ${f.lastName}`}
                  />
                  <Box align="center">
                    <Text size="small" weight="bold">
                      {f.firstName} {f.lastName}
                    </Text>
                    <Text size="small" color="status-disabled">
                      @{f.userName}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </GradientScroll>
          <Divider />
          <Text size="large" color="brand" weight="bold">
            Channels Subscribed To
          </Text>
          <GradientScroll>
            <Box direction="row" gap="medium">
              {userData.joinedChannels.map((c) => (
                <Box key={c.channel_id} gap="small" align="center">
                  <InitialsAvatar id={c.channel_id} value={c.channel_name} />
                  <Box align="center">
                    <Text size="small">{c.channel_name}</Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </GradientScroll>
          <Text size="large" color="brand" weight="bold">
            Zones Joined To
          </Text>
          <GradientScroll>
            <Box direction="row" gap="medium">
              {userData.joinedZones.map((z) => (
                <Box key={z.zone_id} gap="small" align="center">
                  <InitialsAvatar
                    id={z.zone_id}
                    value={z.zone_name}
                    round="small"
                  />
                  <Box align="center">
                    <Text size="small">{z.zone_name}</Text>
                    <Text size="small" color="status-disabled">
                      {z.zone_subdomain}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </GradientScroll>
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
                      onClickPlay={() => {}}
                      onClickSave={() => {}}
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
