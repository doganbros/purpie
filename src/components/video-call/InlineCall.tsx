import React, { FC, useState } from 'react';
import { Box, Text } from 'grommet';
import { Down, Up } from 'grommet-icons';
import { ActiveCallIcon } from './ActiveCallIcon';
import { VideoFrame } from './VideoFrame';
import { useJitsiContext } from './JitsiContext';

interface InlineCallProps {
  onClickVideo: () => void;
  onEndCall: () => void;
  name: string;
}

export const InlineCall: FC<InlineCallProps> = ({
  onClickVideo,
  onEndCall,
  name,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { remoteTracks } = useJitsiContext();

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
          <VideoFrame size={352} displayName={name} tracks={remoteTracks} />
        </Box>
      )}
      <Box direction="row" align="center" gap="medium">
        <Box
          fill
          direction="row"
          gap="small"
          onClick={() => setIsExpanded((p) => !p)}
        >
          <Text weight="normal">{name}</Text>
          {isExpanded ? <Down /> : <Up />}
        </Box>
        <Box onClick={onEndCall}>
          <ActiveCallIcon />
        </Box>
      </Box>
    </Box>
  );
};
