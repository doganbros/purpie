import { Box, Heading, Text } from 'grommet';
import { Halt } from 'grommet-icons';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PrivatePageLayout from '../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import PublicPageLayout from '../../components/layouts/PublicPageLayout/PublicPageLayout';
import { AnchorLink } from '../../components/utils/AnchorLink';
import { AppState } from '../../store/reducers/root.reducer';

const NotFound: FC = () => {
  const { isAuthenticated } = useSelector((state: AppState) => state.auth);
  const { t } = useTranslation();

  const render = (
    <Box align="center" fill justify="center">
      <Box margin="20px">
        <Halt size="xlarge" />
      </Box>
      <Heading>{t('NotFound.title')}</Heading>
      <Text>{t('NotFound.description')}</Text>
      <Box margin="20px">
        {isAuthenticated ? (
          <AnchorLink label={t('NotFound.zones')} to="/" />
        ) : (
          <AnchorLink label={t('NotFound.login')} to="/login" />
        )}
      </Box>
    </Box>
  );

  if (!isAuthenticated)
    return <PublicPageLayout title="404">{render}</PublicPageLayout>;
  return <PrivatePageLayout title="404">{render}</PrivatePageLayout>;
};

export default NotFound;
