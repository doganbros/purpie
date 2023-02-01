import { Box, Grid, Layer, Text } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import PostListItem from '../../../components/post/PostListItem';
import Divider from '../../../components/utils/Divider';
import GradientScroll from '../../../components/utils/GradientScroll';
import { getFeaturedPostAction } from '../../../store/actions/post.action';
import {
  getUserDetailAction,
  removeContactAction,
} from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';
import Header from './Header';
import { userData } from './mock-data';
import { UserSummary } from './UserSummary';
import UserFriends from './UserFriends';
import UserPublicChannels from './UserPublicChannels';
import UserPublicZones from './UserPublicZones';
import PurpieLogoAnimated from '../../../assets/purpie-logo/purpie-logo-animated';
import ConfirmDialog from '../../../components/utils/ConfirmDialog';

interface UserParams {
  userName: string;
}

const User: FC = () => {
  const params = useParams<UserParams>();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const {
    user: { detail },
    post: { featuredPost },
  } = useSelector((state: AppState) => state);
  const history = useHistory();

  const handleShowRemoveDialog = () => {
    setShowRemoveDialog(true);
  };

  useEffect(() => {
    dispatch(getUserDetailAction(params));
  }, []);

  useEffect(() => {
    if (detail.user)
      dispatch(getFeaturedPostAction({ userId: detail.user.id }));
  }, [detail]);

  return (
    <PrivatePageLayout
      title={detail.user ? detail.user.fullName : t('common.loading')}
      topComponent={
        detail.user && (
          <Header
            user={detail.user}
            handleShowRemoveDialog={handleShowRemoveDialog}
          />
        )
      }
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
          <PurpieLogoAnimated width={50} height={50} color="brand" />
        </Layer>
      ) : (
        <Box gap="medium" pad={{ vertical: 'medium' }}>
          {featuredPost.loading && (
            <PurpieLogoAnimated width={50} height={50} color="brand" />
          )}
          {!featuredPost.loading && featuredPost.data && (
            <Text size="small">{t('User.noPinnedPost')}</Text>
          )}
          {featuredPost.data && (
            <PostListItem
              post={featuredPost.data}
              onClickPlay={() => history.push(`video/${featuredPost.data?.id}`)}
            />
          )}

          <Divider />
          <UserFriends userName={params.userName} />
          <Divider />
          <UserPublicChannels userName={params.userName} />
          <UserPublicZones userName={params.userName} />
          <Text size="large" color="brand" weight="bold">
            {t('User.sharedLists')}
          </Text>
          {userData.sharedLists.map((list) => (
            <Box key={list.id} gap="medium">
              <Box>
                <Text weight="bold" size="large">
                  {list.name}
                </Text>
                <Text>
                  {list.posts.length}{' '}
                  {list.posts.length < 2 ? t('User.post') : t('User.posts')}
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
                    />
                  ))}
                </Grid>
              </GradientScroll>
            </Box>
          ))}
        </Box>
      )}
      {showRemoveDialog && (
        <ConfirmDialog
          onDismiss={() => {
            setShowRemoveDialog(false);
          }}
          onConfirm={() => {
            setShowRemoveDialog(false);
            if (detail?.user?.contactUserId) {
              dispatch(removeContactAction(detail.user.contactUserId));
            }
          }}
          confirmButtonText={t('common.remove')}
          message={t('SelectedUser.removeConfirmMsg', {
            fullName: detail?.user?.fullName,
          })}
        />
      )}
    </PrivatePageLayout>
  );
};

export default User;
