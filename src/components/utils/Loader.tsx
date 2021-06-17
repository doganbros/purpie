import { Box, Heading } from 'grommet';
import React, { FC } from 'react';

const Loader: FC = () => {
  return (
    <Box
      height="100vh"
      align="center"
      justify="center"
      className="background-gradient"
    >
      <Heading color="white">Loading...</Heading>
    </Box>
  );
};

export default Loader;
