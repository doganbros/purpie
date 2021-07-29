import { Text, Box } from 'grommet';
import { Down } from 'grommet-icons';
import React, { FC } from 'react';

const ZoneSelector: FC = () => {
  return (
    <Box
      margin="small"
      background="#FFFFFF26"
      round="xxsmall"
      direction="row"
      align="center"
      justify="around"
      pad="small"
    >
      <Text size="xsmall">Doganbros</Text>
      <Down size="small" color="white" />
    </Box>
  );
};

export default ZoneSelector;
