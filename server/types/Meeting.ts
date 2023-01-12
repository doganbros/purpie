type ToolbarButton =
  | 'microphone'
  | 'camera'
  | 'closedcaptions'
  | 'desktop'
  | 'embedmeeting'
  | 'fullscreen'
  | 'fodeviceselection'
  | 'hangup'
  | 'profile'
  | 'chat'
  | 'recording'
  | 'livestreaming'
  | 'etherpad'
  | 'sharedvideo'
  | 'shareaudio'
  | 'settings'
  | 'raisehand'
  | 'videoquality'
  | 'filmstrip'
  | 'feedback'
  | 'stats'
  | 'shortcuts'
  | 'tileview'
  | 'select-background'
  | 'download'
  | 'help'
  | 'mute-everyone'
  | 'mute-video-everyone'
  | 'security';

export class JitsiConfig {
  startWithAudioMuted?: boolean;

  enableNoisyMicDetection?: boolean;

  disableResponsiveTiles?: boolean;

  hideLobbyButton?: boolean;

  disableProfile?: boolean;

  disableRecordAudioNotification?: boolean;

  disableRemoteMute?: boolean;

  enableNoAudioDetection?: boolean;

  startScreenSharing?: boolean;

  disableJoinLeaveSounds?: boolean;

  hideConferenceSubject?: boolean;

  hideParticipantsStats?: boolean;

  hideConferenceTimer?: boolean;

  fileRecordingsEnabled?: boolean;

  defaultLanguage?: string;

  subject?: string;

  liveStreamingEnabled?: boolean;

  autoCaptionOnRecord?: boolean;

  disableShortcuts?: boolean;

  requireDisplayName?: boolean;

  startAudioMuted?: number;

  startVideoMuted?: number;

  startWithVideoMuted?: boolean;

  transcribingEnabled?: boolean;

  prejoinPageEnabled?: boolean;

  startAudioOnly?: boolean;

  toolbarButtons?: Array<ToolbarButton>;

  disableAudioLevels?: boolean;

  disableTileView?: boolean;

  audioLevelsInterval?: number;
}

class PrivacyConfig {
  public?: boolean;

  liveStream?: boolean;

  record?: boolean;

  joinLinkExpiryAsHours?: number;
}

export class MeetingConfig {
  jitsiConfig: JitsiConfig;

  privacyConfig: PrivacyConfig;
}

export type JitsiConfigKey = keyof JitsiConfig;
export type PrivacyConfigKey = keyof PrivacyConfig;

export type MeetingKey = keyof MeetingConfig;
