import React, { FC } from 'react';
import { Box, Stack } from 'grommet';
import { Group } from 'grommet-icons';
import { getColorPairFromId } from '../../helpers/utils';

interface ImagePostProps {
  id: number;
}

export const ImagePost: FC<ImagePostProps> = ({ id }) => {
  const { foreground, background } = getColorPairFromId(id);
  return (
    <Stack anchor="center">
      <Box
        flex="grow"
        background={background}
        pad={{ top: '56.25%' }} // For 16 by 9 aspect ratio
      />
      <Group size="xlarge" color={foreground} />
    </Stack>
  );
};
