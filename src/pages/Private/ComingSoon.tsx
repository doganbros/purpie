import { Box, Heading, Text } from 'grommet';
import { Connect } from 'grommet-icons';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PrivatePageLayout from '../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import PublicPageLayout from '../../components/layouts/PublicPageLayout/PublicPageLayout';
import { AppState } from '../../store/reducers/root.reducer';

const ComingSoon: FC = () => {
  const { isAuthenticated } = useSelector((state: AppState) => state.auth);
  const { t } = useTranslation();

  const render = (
    <Box align="center" fill justify="center">
      <Box margin="20px">
        <Connect size="xlarge" />
      </Box>
      <Heading>{t('ComingSoon.title')}</Heading>
      <Text>{t('ComingSoon.description')}</Text>
    </Box>
  );

  if (!isAuthenticated)
    return (
      <PublicPageLayout title={t('ComingSoon.title')}>
        {render}
      </PublicPageLayout>
    );
  return (
    <PrivatePageLayout title={t('ComingSoon.title')}>
      {render}
    </PrivatePageLayout>
  );
};

export default ComingSoon;
