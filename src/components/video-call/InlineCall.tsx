import React, { FC, useState } from 'react';
import { Box, Text } from 'grommet';
import { Down, Up } from 'grommet-icons';
import { ActiveCallIcon } from './ActiveCallIcon';
import { VideoFrame } from './VideoFrame';

interface InlineCallProps {
  onClickVideo: () => void;
}

export const InlineCall: FC<InlineCallProps> = ({ onClickVideo }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <Box
      elevation="large"
      round="large"
      pad="medium"
      background="white"
      width="400px"
      gap="medium"
    >
      {isExpanded && (
        <Box onClick={onClickVideo}>
          <VideoFrame size={352} />
        </Box>
      )}
      <Box direction="row" align="center" gap="medium">
        <Box
          fill
          direction="row"
          gap="small"
          onClick={() => setIsExpanded((p) => !p)}
        >
          <Text weight="normal">Test User</Text>
          {isExpanded ? <Down /> : <Up />}
        </Box>
        <Box direction="row" gap="small">
          <ActiveCallIcon />
        </Box>
      </Box>
    </Box>
  );
};
