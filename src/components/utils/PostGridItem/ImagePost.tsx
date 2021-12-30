import React, { FC } from 'react';
import { Box, Stack } from 'grommet';
import { Group } from 'grommet-icons';

export const ImagePost: FC = () => {
  return (
    <Stack anchor="center">
      <Box
        flex="grow"
        background="brand"
        pad={{ top: '56.25%' }} // For 16 by 9 aspect ratio
      />
      <Group size="xlarge" color="white" />
    </Stack>
  );
};
