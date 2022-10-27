import { Box, Heading } from 'grommet';
import React, { FC } from 'react';
// import { useTranslation } from 'react-i18next';
import PurpieLogoAnimated from '../../assets/purpie-logo/purpie-logo-animated';

const Loader: FC = () => {
  // const { t } = useTranslation();
  return (
    <Box
      height="100vh"
      align="center"
      justify="center"
      className="background-gradient"
    >
      <Heading color="white">
        <PurpieLogoAnimated width={100} height={100} />
      </Heading>
    </Box>
  );
};

export default Loader;
