import React from 'react';
import { Box } from 'grommet';
import PublicPageLayout from './PublicPageLayout/PublicPageLayout';
import Background from '../../assets/background.png';

interface Props {
  title: string;
}

const AuthLayout: React.FC<Props> = ({ title, children }) => {
  return (
    <PublicPageLayout title={title}>
      <Box
        fill
        align="center"
        justify="center"
        background={{ image: `url('${Background}')`, color: 'grey' }}
      >
        {children}
      </Box>
    </PublicPageLayout>
  );
};

export default AuthLayout;
