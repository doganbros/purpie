import { Box, Heading, Image, Text } from 'grommet';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PrivatePageLayout from '../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import PublicPageLayout from '../../components/layouts/PublicPageLayout/PublicPageLayout';
import { AnchorLink } from '../../components/utils/AnchorLink';
import { AppState } from '../../store/reducers/root.reducer';
import { useResponsive } from '../../hooks/useResponsive';
import NotFoundImage from '../../assets/404.svg';

const NotFound: FC = () => {
  const { isAuthenticated } = useSelector((state: AppState) => state.auth);
  const size = useResponsive();
  const { t } = useTranslation();

  const render = (
    <Box
      height={size === 'small' ? 'calc(100vh - 120px)' : '100vh'}
      align="center"
      fill="horizontal"
      justify="center"
    >
      <Image width={size === 'small' ? '240px' : '480px'} src={NotFoundImage} />
      <Heading
        level="2"
        color="dark"
        margin={{ top: 'large', bottom: 'small' }}
      >
        {t('NotFound.title')}
      </Heading>
      <Box width={{ max: 'medium' }}>
        <Text
          weight="normal"
          size="small"
          color="status-disabled"
          textAlign="center"
        >
          {t('NotFound.description')}
        </Text>
      </Box>
      <Box margin={{ top: 'small' }}>
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
