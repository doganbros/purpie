import { Box, Heading, Text } from 'grommet';
import { Connect } from 'grommet-icons';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import PrivatePageLayout from '../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import PublicPageLayout from '../../components/layouts/PublicPageLayout/PublicPageLayout';
import { AppState } from '../../store/reducers/root.reducer';

const ComingSoon: FC = () => {
  const { isAuthenticated } = useSelector((state: AppState) => state.auth);

  const render = (
    <Box align="center" fill justify="center">
      <Box margin="20px">
        <Connect size="xlarge" />
      </Box>
      <Heading>Coming Soon</Heading>
      <Text>
        Stay tuned. We are launching soon. We are working hard. We are almost
        ready to launch.
      </Text>
    </Box>
  );

  if (!isAuthenticated)
    return <PublicPageLayout title="Coming Soon">{render}</PublicPageLayout>;
  return <PrivatePageLayout title="Coming Soon">{render}</PrivatePageLayout>;
};

export default ComingSoon;
