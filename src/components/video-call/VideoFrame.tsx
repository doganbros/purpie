import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { Microphone, MoreVertical } from 'grommet-icons';
import { HeightType } from 'grommet/utils';

interface VideoFrameProps {
  height?: HeightType;
}

export const VideoFrame: FC<VideoFrameProps> = ({ height = '250px' }) => {
  return (
    <Box height={height}>
      <Box
        background={{ color: 'teal' }}
        fill
        round="medium"
        align="stretch"
        overflow="hidden"
      >
        <Box direction="row" overflow="hidden" justify="between">
          <Box background={{ color: 'brand-alt', opacity: 0.7 }} pad="small">
            <Text color="white">Meeting User</Text>
          </Box>
          <Box
            background={{ color: 'black', opacity: 0.7 }}
            pad="small"
            direction="row"
            align="center"
            gap="small"
          >
            <Microphone size="20px" />
            <MoreVertical size="20px" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
