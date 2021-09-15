import React, { FC } from 'react';
import { Box } from 'grommet';

const Divider: FC = () => (
  <Box
    fill="horizontal"
    height="1px"
    background="light-6"
    margin={{ vertical: 'xsmall' }}
  />
);

export default Divider;
