import { Box, Heading, Text } from 'grommet';
import { Halt } from 'grommet-icons';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import PrivatePageLayout from '../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import PublicPageLayout from '../../components/layouts/PublicPageLayout/PublicPageLayout';
import { AnchorLink } from '../../components/utils/AnchorLink';
import { AppState } from '../../store/reducers/root.reducer';

const NotFound: FC = () => {
  const { isAuthenticated } = useSelector((state: AppState) => state.auth);

  const render = (
    <Box align="center" fill justify="center">
      <Box margin="20px">
        <Halt size="xlarge" />
      </Box>
      <Heading>Page not found</Heading>
      <Text>
        It looks like you may have taken a wrong turn. Do not worry... it
        happens to the best of us.
      </Text>
      <Box margin="20px">
        {isAuthenticated ? (
          <AnchorLink label="Tenants" to="/" />
        ) : (
          <AnchorLink label="Login" to="/login" />
        )}
      </Box>
    </Box>
  );

  if (!isAuthenticated)
    return <PublicPageLayout title="404">{render}</PublicPageLayout>;
  return <PrivatePageLayout title="404">{render}</PrivatePageLayout>;
};

export default NotFound;
