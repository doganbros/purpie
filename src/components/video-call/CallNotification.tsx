import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { AnswerIcon } from './AnswerIcon';
import { RejectIcon } from './RejectIcon';

export const CallNotification: FC = () => {
  return (
    <Box
      elevation="large"
      round="large"
      pad="medium"
      background="white"
      width="400px"
      direction="row"
      align="center"
    >
      <Box fill>
        <Text weight="normal">Test User</Text>
      </Box>
      <Box direction="row" gap="small">
        <AnswerIcon />
        <RejectIcon />
      </Box>
    </Box>
  );
};
