import React, { FC } from 'react';
import { Box } from 'grommet';
import { MarginType } from 'grommet/utils';

interface Props {
  margin?: MarginType;
}

const Divider: FC<Props> = ({ margin = { vertical: 'xsmall' } }) => (
  <Box fill="horizontal" height="1px" background="light-6" margin={margin} />
);

export default Divider;
