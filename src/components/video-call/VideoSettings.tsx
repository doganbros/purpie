import React, { FC, useEffect, useState } from 'react';
import { Box, Select } from 'grommet';
import { useJitsiContext } from './VideoCallContext';
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
  const [audioOutputDevices, setAudioOutputDevices] = useState<
    MediaDeviceInfo[]
  >([]);

  const [
    selectedVideoDevice,
    setSelectedVideoDevice,
  ] = useState<MediaDeviceInfo>();

  const [
    selectedAudioInputDevice,
    setSelectedAudioInputDevice,
  ] = useState<MediaDeviceInfo>();

  const [
    selectedAudioOutputDevice,
    setSelectedAudioOutputDevice,
  ] = useState<MediaDeviceInfo>();

  const setAvailableDevices = async () => {
    const mediaDevices = await enumerateDevices();
    mediaDevices.forEach((d) => {
      if (d.kind === 'videoinput') {
        setVideoDevices((p) => [...p, d]);
      } else if (d.kind === 'audioinput') {
        setAudioInputDevices((p) => [...p, d]);
      } else if (d.kind === 'audiooutput') {
        setAudioOutputDevices((p) => [...p, d]);
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
      <Box background="white" pad="small" round="medium">
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
        Audio Output
        <Select
          options={audioOutputDevices}
          value={selectedAudioOutputDevice}
          labelKey="label"
          onChange={({ option }) => setSelectedAudioOutputDevice(option)}
        />
        <Box onClick={onDismiss}>Dismiss</Box>
      </Box>
    </Box>
  );
};
