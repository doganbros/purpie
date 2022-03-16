import { Box, Layer, Spinner } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import SearchBar from '../../../components/utils/SearchBar';
import { getUserDetailAction } from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';
import ChannelsToFollow from '../timeline/ChannelsToFollow';
import LastActivities from '../timeline/LastActivities';
import ZonesToJoin from '../timeline/ZonesToJoin';
import Header from './Header';

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
        <Box pad="medium" gap="medium">
          <SearchBar />
          <ChannelsToFollow />
          <Divider />
          <ZonesToJoin />
          <LastActivities />
        </Box>
      }
    >
      {detail.loading || !detail.user ? (
        <Layer responsive={false} plain>
          <Spinner />
        </Layer>
      ) : (
        <Box gap="large" pad={{ vertical: 'medium' }}>
          <pre>{JSON.stringify(detail.user, null, 2)}</pre>
        </Box>
      )}
    </PrivatePageLayout>
  );
};

export default User;
