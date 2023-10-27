import React, { FC, useState } from 'react';
import { Box, Layer, Stack, Text } from 'grommet';
import { Close } from 'grommet-icons';
import { VideoFrame } from './VideoFrame';
import { useJitsiContext } from './JitsiContext';
import { VideoSettings } from './VideoSettings';

interface MaximizedCallProps {
  onDismiss: () => void;
}

export const MaximizedCall: FC<MaximizedCallProps> = ({ onDismiss }) => {
  const { localTracks, remoteTracks } = useJitsiContext();
  const [showSettings, setShowSettings] = useState(false);
  return (
    <>
      <Box
        elevation="large"
        round="small"
        width="470px"
        align="stretch"
        overflow="hidden"
      >
        <Box
          background="brand-alt"
          pad="medium"
          direction="row"
          align="center"
          justify="between"
        >
          <Box
            background={{ color: 'black', opacity: 0.5 }}
            round="xsmall"
            overflow="hidden"
            direction="row"
          >
            <Box
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              width={{ min: '200px' }}
            >
              <Text>Meeting</Text>
            </Box>
            <Box
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              background={{ color: 'black', opacity: 0.5 }}
            >
              <Text>5:12</Text>
            </Box>
          </Box>
          <Close color="white" onClick={onDismiss} />
        </Box>
        <Box pad="medium" background="white">
          <Stack anchor="bottom-right">
            <VideoFrame size={430} tracks={remoteTracks} />
            <VideoFrame
              size={220}
              tracks={localTracks}
              local
              onClickSettings={() => setShowSettings(true)}
            />
          </Stack>
        </Box>
      </Box>
      {showSettings && (
        <Layer
          background={{ opacity: 0 }}
          onEsc={() => setShowSettings(false)}
          onClickOutside={() => setShowSettings(false)}
        >
          <VideoSettings onDismiss={() => setShowSettings(false)} />
        </Layer>
      )}
    </>
  );
};
