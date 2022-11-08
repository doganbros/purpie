import { Box, Heading } from 'grommet';
import React, { FC } from 'react';
import PurpieLogoAnimated from '../../assets/purpie-logo/purpie-logo-animated';

const Loader: FC = () => {
  return (
    <Box height="100vh" align="center" justify="center" background="brand">
      <Heading color="white">
        <PurpieLogoAnimated width={100} height={100} color="#FFFFFF" />
      </Heading>
    </Box>
  );
};

export default Loader;
