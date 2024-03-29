import React, { FC, useEffect, useRef, useState } from 'react';
import { Box, Stack, Text } from 'grommet';
import { Camera, Microphone, MoreVertical } from 'grommet-icons';
import { StyledVideo } from './StyledVideo';
import { UserAvatar } from '../utils/Avatars/UserAvatar';

interface VideoFrameProps {
  userId?: string;
  displayPhoto?: string;
  size?: number;
  tracks?: any[];
  displayName?: string;
  local?: boolean;
  onClickSettings?: () => void;
}

export const VideoFrame: FC<VideoFrameProps> = ({
  size = 250,
  tracks = [],
  local = false,
  displayName,
  onClickSettings,
  userId = '',
  displayPhoto,
}) => {
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  const videoTrack = tracks.find((t) => t.getType() === 'video');
  const audioTrack = tracks.find((t) => t.getType() === 'audio');

  const [isVideoMuted, setIsVideoMuted] = useState(videoTrack?.isMuted());
  const [isAudioMuted, setIsAudioMuted] = useState(audioTrack?.isMuted());

  const toggleMuteAudio = () => {
    if (audioTrack?.isMuted()) {
      audioTrack?.unmute();
    } else {
      audioTrack?.mute();
    }
  };

  const toggleMuteVideo = () => {
    if (videoTrack?.isMuted()) {
      videoTrack?.unmute();
    } else {
      videoTrack?.mute();
    }
  };

  useEffect(() => {
    const handleVideoMuteChange = (t: any) => {
      setIsVideoMuted(t.isMuted());
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
      setIsAudioMuted(t.isMuted());
    };

    setIsAudioMuted(audioTrack?.isMuted());

    audioTrack?.addEventListener(
      JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
      handleAudioMuteChange
    );

    return () => {
      audioTrack?.removeEventListener(
        window.JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
        handleAudioMuteChange
      );
    };
  }, [audioTrack]);

  return (
    <Box width={`${size}px`} height={`${size}px`}>
      <Box
        background="dark"
        fill
        round="medium"
        align="stretch"
        overflow="hidden"
        border={{ side: 'all', color: 'brand' }}
      >
        <Stack anchor="top" fill guidingChild="last">
          <Stack anchor="center">
            <Box width={`${size}px`} height={`${size}px`}>
              <StyledVideo
                ref={videoElementRef}
                autoPlay
                fit="cover"
                hidden={isVideoMuted}
                controls={false}
                mirrored={local}
              />
            </Box>
            <UserAvatar
              size="xlarge"
              textProps={{
                size: 'xlarge',
              }}
              id={userId || '1'}
              name={displayName}
              src={displayPhoto}
            />
          </Stack>
          <Box
            direction="row"
            overflow="hidden"
            justify="between"
            margin="small"
          >
            {displayName && !local ? (
              <Box
                background={{ color: 'brand-alt' }}
                pad="small"
                round="small"
              >
                <Text color="white">{displayName}</Text>
              </Box>
            ) : (
              <Box />
            )}

            <Box
              background={{ color: 'black', opacity: 0.7 }}
              pad="small"
              direction="row"
              align="center"
              gap="small"
              round="small"
            >
              <Microphone
                size="20px"
                onClick={local ? toggleMuteAudio : undefined}
                color={isAudioMuted ? 'status-error' : 'white'}
              />
              <Camera
                size="20px"
                onClick={local ? toggleMuteVideo : undefined}
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
