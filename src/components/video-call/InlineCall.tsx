import { Box, Text } from 'grommet';
import React, { FC } from 'react';
import { Up } from 'grommet-icons';
import { ActiveCallIcon } from './ActiveCallIcon';
import { VideoFrame } from './VideoFrame';

export const InlineCall: FC = () => {
  return (
    <div style={{ zIndex: 100, position: 'fixed', bottom: 0, right: 0 }}>
      <Box
        elevation="large"
        round="large"
        pad="medium"
        background="white"
        width="400px"
        gap="medium"
      >
        <VideoFrame />
        <Box direction="row" align="center">
          <Box fill direction="row" gap="small">
            <Text weight="normal">Test User</Text>
            <Up />
          </Box>
          <Box direction="row" gap="small">
            <ActiveCallIcon />
          </Box>
        </Box>
      </Box>
    </div>
  );
};
