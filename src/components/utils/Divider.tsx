import { Box } from 'grommet';
import React, { FC } from 'react';
import { theme } from '../../config/app-config';

interface Props {
  dashed?: boolean;
  color?: string;
}

const Divider: FC<Props> = ({ dashed, color = 'light-3' }) => (
  <Box
    height="3px"
    fill="horizontal"
    background={
      dashed
        ? `linear-gradient(to right, ${theme.global?.colors?.[color]} 50%, rgba(255, 255, 255, 0) 0%) top/30px 1px repeat-x`
        : theme.global?.colors?.[color]
    }
  />
);

export default Divider;
