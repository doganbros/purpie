import React, { FC } from 'react';
import { Box } from 'grommet';

interface DividerProps {
  color?: string;
}

const Divider: FC<DividerProps> = ({ color = 'light-6' }) => (
  <Box
    fill="horizontal"
    height="1px"
    background={color}
    margin={{ vertical: 'xsmall' }}
  />
);

export default Divider;
