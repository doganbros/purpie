import React, { FC, useState } from 'react';
import { Box, Layer, Text } from 'grommet';
import { Close } from 'grommet-icons';
import { useSelector } from 'react-redux';
import { VideoFrame } from './VideoFrame';
import { useJitsiContext } from './JitsiContext';
import { VideoSettings } from './VideoSettings';
import { AppState } from '../../store/reducers/root.reducer';

interface MaximizedCallProps {
  onDismiss: () => void;
}

export const MaximizedCall: FC<MaximizedCallProps> = ({ onDismiss }) => {
  const { localTracks, remoteTracks } = useJitsiContext();
  const [showSettings, setShowSettings] = useState(false);
  const {
    auth: { user },
    videocall: { activeCall },
  } = useSelector((state: AppState) => state);
  return (
    <>
      <Box
        elevation="large"
        round="small"
        width="916px"
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
              <Text>{activeCall?.meetingRoomName}</Text>
            </Box>
          </Box>
          <Close color="white" onClick={onDismiss} />
        </Box>
        <Box pad="medium" background="white" direction="row" gap="small">
          <VideoFrame
            size={422}
            tracks={remoteTracks}
            displayName={activeCall?.user.name}
            userId={activeCall?.user.id}
            displayPhoto={activeCall?.user.avatar}
          />
          <VideoFrame
            size={422}
            tracks={localTracks}
            displayName={user?.fullName}
            displayPhoto={user?.displayPhoto}
            userId={user?.id}
            local
            onClickSettings={() => setShowSettings(true)}
          />
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
