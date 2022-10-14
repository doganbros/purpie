import { Box, Heading } from 'grommet';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

const Loader: FC = () => {
  const { t } = useTranslation();
  return (
    <Box
      height="100vh"
      align="center"
      justify="center"
      className="background-gradient"
    >
      <Heading color="white">{t('common.loading')}</Heading>
    </Box>
  );
};

export default Loader;
