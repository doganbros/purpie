import { Box, Heading, Image, Text } from 'grommet';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import PrivatePageLayout from '../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import PublicPageLayout from '../../components/layouts/PublicPageLayout/PublicPageLayout';
import { AppState } from '../../store/reducers/root.reducer';
import ComingSoonImage from '../../assets/coming-soon.svg';
import { useResponsive } from '../../hooks/useResponsive';

const ComingSoon: FC = () => {
  const { isAuthenticated } = useSelector((state: AppState) => state.auth);
  const size = useResponsive();

  const render = (
    <Box
      height={size === 'small' ? 'calc(100vh - 120px)' : '100vh'}
      align="center"
      fill="horizontal"
      justify="center"
    >
      <Image
        width={size === 'small' ? '240px' : '480px'}
        src={ComingSoonImage}
      />
      <Heading
        level="2"
        color="dark"
        margin={{ top: 'large', bottom: 'small' }}
      >
        Coming Soon
      </Heading>
      <Box width={{ max: 'medium' }}>
        <Text
          weight="normal"
          size="small"
          color="status-disabled"
          textAlign="center"
        >
          Start registering new zones and following new channels. Please create
          your first video content.
        </Text>
      </Box>
    </Box>
  );

  if (!isAuthenticated)
    return <PublicPageLayout title="Coming Soon">{render}</PublicPageLayout>;
  return <PrivatePageLayout title="Coming Soon">{render}</PrivatePageLayout>;
};

export default ComingSoon;
