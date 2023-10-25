import React, { FC, useEffect, useRef, useState } from 'react';
import { Box, Stack, Text, Video } from 'grommet';
import { Camera, Microphone, MoreVertical } from 'grommet-icons';
import { HeightType } from 'grommet/utils';

interface VideoFrameProps {
  height?: HeightType;
  tracks?: any[];
  displayName?: string;
  local?: boolean;
  onClickSettings?: () => void;
}

export const VideoFrame: FC<VideoFrameProps> = ({
  height = '250px',
  tracks = [],
  local = false,
  displayName = 'Test User',
  onClickSettings,
}) => {
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const videoTrack = tracks.find((t) => t.getType() === 'video');
  const audioTrack = tracks.find((t) => t.getType() === 'audio');

  const [isVideoMuted, setIsVideoMuted] = useState(videoTrack?.isMuted());
  const [isAudioMuted, setIsAudioMuted] = useState(audioTrack?.isMuted());

  useEffect(() => {
    const handleVideoMuteChange = (t: any) => {
      setIsVideoMuted(t.muted);
    };

    setIsVideoMuted(videoTrack?.isMuted());
    videoTrack?.attach(videoElementRef.current);

    videoTrack?.addEventListener(
      JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
      handleVideoMuteChange
    );

    return () => {
      videoTrack?.detach(videoElementRef.current);
      videoTrack?.removeEventListener(
        window.JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
        handleVideoMuteChange
      );
    };
  }, [videoTrack]);

  useEffect(() => {
    const handleAudioMuteChange = (t: any) => {
      setIsAudioMuted(t.muted);
    };

    setIsAudioMuted(audioTrack?.isMuted());
    audioTrack?.attach(audioElementRef.current);

    audioTrack?.addEventListener(
      JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
      handleAudioMuteChange
    );

    return () => {
      audioTrack?.detach(audioElementRef.current);
      audioTrack?.removeEventListener(
        window.JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
        handleAudioMuteChange
      );
    };
  }, [audioTrack]);

  return (
    <Box height={height} style={{ aspectRatio: ' 1.7' }}>
      <Box
        background="dark"
        fill
        round="medium"
        align="stretch"
        overflow="hidden"
        border={{ side: 'all', color: 'brand' }}
      >
        <Stack anchor="top" fill guidingChild="last">
          <Box fill>
            <Video
              ref={videoElementRef}
              autoPlay
              fit="contain"
              controls={false}
            />
            <audio ref={audioElementRef} />
          </Box>
          <Box direction="row" overflow="hidden" justify="between">
            <Box background={{ color: 'brand-alt', opacity: 0.7 }} pad="small">
              <Text color="white">{displayName}</Text>
            </Box>

            <Box
              background={{ color: 'black', opacity: 0.7 }}
              pad="small"
              direction="row"
              align="center"
              gap="small"
            >
              <Microphone
                size="20px"
                color={isAudioMuted ? 'status-error' : 'white'}
              />
              <Camera
                size="20px"
                color={isVideoMuted ? 'status-error' : 'white'}
              />
              {local && <MoreVertical size="20px" onClick={onClickSettings} />}
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};
