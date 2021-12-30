import React, { FC } from 'react';
import { Box } from 'grommet';
import { Group } from 'grommet-icons';

export const ImagePost: FC = () => {
  return (
    <Box
      flex="grow"
      background="brand"
      justify="evenly"
      direction="row"
      align="center"
    >
      <Group size="xlarge" color="white" />
    </Box>
  );
};
