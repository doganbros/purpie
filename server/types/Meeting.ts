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
  | 'invite'
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

export class MeetingConfig {
  startWithAudioMuted?: boolean;

  enableNoisyMicDetection?: boolean;

  disableResponsiveTiles?: boolean;

  hideLobbyButton?: boolean;

  disableProfile?: boolean;

  roomPasswordNumberOfDigits?: boolean;

  enableInsecureRoomNameWarning?: boolean;

  enableAutomaticUrlCopy?: boolean;

  disableRecordAudioNotification?: boolean;

  disableRemoteMute?: boolean;

  enableNoAudioDetection?: boolean;

  startScreenSharing?: boolean;

  disableJoinLeaveSounds?: boolean;

  hideConferenceSubject?: boolean;

  hideParticipantsStats?: boolean;

  hideConferenceTimer?: boolean;

  inviteAppName?: string | null;

  fileRecordingsEnabled?: boolean;

  defaultLanguage?: string;

  subject?: string;

  liveStreamingEnabled?: boolean;

  requireDisplayName?: boolean;

  startAudioMuted?: number;

  startVideoMuted?: number;

  startWithVideoMuted?: boolean;

  prejoinPageEnabled?: boolean;

  startAudioOnly?: boolean;

  toolbarButtons?: Array<ToolbarButton>;

  disableAudioLevels?: boolean;

  audioLevelsInterval?: number;
}

export type MeetingKey = keyof MeetingConfig;
