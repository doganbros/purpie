import React, { FC, useEffect, useState } from 'react';
import { Box, Select, Text } from 'grommet';
import { useTranslation } from 'react-i18next';
import { useJitsiContext } from './JitsiContext';
import { enumerateDevices } from './utils';

interface VideoSettingsProps {
  onDismiss: () => void;
}
export const VideoSettings: FC<VideoSettingsProps> = ({ onDismiss }) => {
  const { t } = useTranslation();

  const { localTracks, changeDevices } = useJitsiContext();
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);

  const [
    selectedVideoDevice,
    setSelectedVideoDevice,
  ] = useState<MediaDeviceInfo>();

  const [
    selectedAudioDevice,
    setSelectedAudioDevice,
  ] = useState<MediaDeviceInfo>();

  const setAvailableDevices = async () => {
    await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const mediaDevices = await enumerateDevices();
    mediaDevices.forEach((d) => {
      if (d.kind === 'videoinput') {
        setVideoDevices((p) => [...p, d]);
      } else if (d.kind === 'audioinput') {
        setAudioDevices((p) => [...p, d]);
      }
    });
  };

  useEffect(() => {
    setAvailableDevices();
  }, []);

  useEffect(() => {
    const currentVideoDeviceId = localTracks
      .find((track) => track.getType() === 'video')
      ?.getDeviceId();
    setSelectedVideoDevice(
      videoDevices.find((d) => d.deviceId === currentVideoDeviceId)
    );
  }, [videoDevices]);

  useEffect(() => {
    const currentAudioDeviceId = localTracks
      .find((track) => track.getType() === 'audio')
      ?.getDeviceId();
    setSelectedAudioDevice(
      audioDevices.find((d) => d.deviceId === currentAudioDeviceId)
    );
  }, [audioDevices]);

  const onApply = () => {
    changeDevices(selectedVideoDevice?.deviceId, selectedAudioDevice?.deviceId);
    onDismiss();
  };

  return (
    <Box
      width="100%"
      height="100%"
      background={{ color: 'dark', opacity: 'weak' }}
    >
      <Box background="white" pad="small" round="medium" gap="small">
        {t('OneOnOneCall.settingsVideo')}
        <Select
          options={videoDevices}
          value={selectedVideoDevice}
          labelKey="label"
          onChange={({ option }) => setSelectedVideoDevice(option)}
        />
        {t('OneOnOneCall.settingsAudio')}

        <Select
          options={audioDevices}
          value={selectedAudioDevice}
          labelKey="label"
          onChange={({ option }) => setSelectedAudioDevice(option)}
        />
        <Box
          border={{ color: 'brand', size: '2px' }}
          round="small"
          pad="xsmall"
          justify="center"
          align="center"
          onClick={onApply}
        >
          <Text color="brand" weight="bold">
            {t('OneOnOneCall.settingsApply')}
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
          <Text color="brand"> {t('OneOnOneCall.settingsDismiss')}</Text>
        </Box>
      </Box>
    </Box>
  );
};
