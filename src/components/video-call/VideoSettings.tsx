import React, { FC, useEffect, useState } from 'react';
import { Box, Select, Text } from 'grommet';
import { useJitsiContext } from './JitsiContext';
import { enumerateDevices } from './utils';

interface VideoSettingsProps {
  onDismiss: () => void;
}
export const VideoSettings: FC<VideoSettingsProps> = ({ onDismiss }) => {
  const { localTracks } = useJitsiContext();
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>(
    []
  );

  const [
    selectedVideoDevice,
    setSelectedVideoDevice,
  ] = useState<MediaDeviceInfo>();

  const [
    selectedAudioInputDevice,
    setSelectedAudioInputDevice,
  ] = useState<MediaDeviceInfo>();

  const setAvailableDevices = async () => {
    const mediaDevices = await enumerateDevices();
    mediaDevices.forEach((d) => {
      if (d.kind === 'videoinput') {
        setVideoDevices((p) => [...p, d]);
      } else if (d.kind === 'audioinput') {
        setAudioInputDevices((p) => [...p, d]);
      }
    });
  };

  useEffect(() => {
    setAvailableDevices();
  }, []);

  useEffect(() => {
    const currentVideoDeviceId = localTracks
      .find((t) => t.getType() === 'video')
      ?.getDeviceId();
    setSelectedVideoDevice(
      videoDevices.find((d) => d.deviceId === currentVideoDeviceId)
    );
  }, [videoDevices]);

  useEffect(() => {
    const currentAudioDeviceId = localTracks
      .find((t) => t.getType() === 'audio')
      ?.getDeviceId();
    setSelectedAudioInputDevice(
      audioInputDevices.find((d) => d.deviceId === currentAudioDeviceId)
    );
  }, [audioInputDevices]);

  return (
    <Box
      width="100%"
      height="100%"
      background={{ color: 'dark', opacity: 'weak' }}
    >
      <Box background="white" pad="small" round="medium" gap="small">
        Video
        <Select
          options={videoDevices}
          value={selectedVideoDevice}
          labelKey="label"
          onChange={({ option }) => setSelectedVideoDevice(option)}
        />
        Audio
        <Select
          options={audioInputDevices}
          value={selectedAudioInputDevice}
          labelKey="label"
          onChange={({ option }) => setSelectedAudioInputDevice(option)}
        />
        <Box
          border={{ color: 'brand', size: '2px' }}
          round="small"
          pad="xsmall"
          justify="center"
          align="center"
        >
          <Text color="brand" weight="bold">
            Apply
          </Text>
        </Box>
        <Box
          onClick={onDismiss}
          border={{ color: 'brand', size: '2px' }}
          round="small"
          pad="xsmall"
          justify="center"
          align="center"
        >
          <Text color="brand">Dismiss</Text>
        </Box>
      </Box>
    </Box>
  );
};
