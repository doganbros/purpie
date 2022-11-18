import React, { FC } from 'react';
import { Box } from 'grommet';
import { MarginType } from 'grommet/utils';

interface DividerProps {
  color?: string;
  margin?: MarginType;
}

const Divider: FC<DividerProps> = ({
  color = 'light-6',
  margin = { vertical: 'xsmall' },
}) => <Box fill="horizontal" height="1px" background={color} margin={margin} />;

export default Divider;
