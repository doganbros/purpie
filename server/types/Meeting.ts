import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @ApiPropertyOptional()
  startWithAudioMuted?: boolean;

  @ApiPropertyOptional()
  enableNoisyMicDetection?: boolean;

  @ApiPropertyOptional()
  disableResponsiveTiles?: boolean;

  @ApiPropertyOptional()
  hideLobbyButton?: boolean;

  @ApiPropertyOptional()
  disableProfile?: boolean;

  @ApiPropertyOptional()
  disableRecordAudioNotification?: boolean;

  @ApiPropertyOptional()
  disableRemoteMute?: boolean;

  @ApiPropertyOptional()
  enableNoAudioDetection?: boolean;

  @ApiPropertyOptional()
  startScreenSharing?: boolean;

  @ApiPropertyOptional()
  disableJoinLeaveSounds?: boolean;

  @ApiPropertyOptional()
  hideConferenceSubject?: boolean;

  @ApiPropertyOptional()
  hideParticipantsStats?: boolean;

  @ApiPropertyOptional()
  hideConferenceTimer?: boolean;

  @ApiPropertyOptional()
  fileRecordingsEnabled?: boolean;

  @ApiPropertyOptional()
  defaultLanguage?: string;

  @ApiPropertyOptional()
  subject?: string;

  @ApiPropertyOptional()
  liveStreamingEnabled?: boolean;

  @ApiPropertyOptional()
  autoCaptionOnRecord?: boolean;

  @ApiPropertyOptional()
  disableShortcuts?: boolean;

  @ApiPropertyOptional()
  requireDisplayName?: boolean;

  @ApiPropertyOptional()
  startAudioMuted?: number;

  @ApiPropertyOptional()
  startVideoMuted?: number;

  @ApiPropertyOptional()
  startWithVideoMuted?: boolean;

  @ApiPropertyOptional()
  transcribingEnabled?: boolean;

  @ApiPropertyOptional()
  prejoinPageEnabled?: boolean;

  @ApiPropertyOptional()
  startAudioOnly?: boolean;

  @ApiPropertyOptional()
  toolbarButtons?: Array<ToolbarButton>;

  @ApiPropertyOptional()
  disableAudioLevels?: boolean;

  @ApiPropertyOptional()
  disableTileView?: boolean;

  @ApiPropertyOptional()
  audioLevelsInterval?: number;
}

export class PrivacyConfig {
  @ApiPropertyOptional()
  public?: boolean;

  @ApiPropertyOptional()
  liveStream?: boolean;

  @ApiPropertyOptional()
  record?: boolean;

  @ApiPropertyOptional()
  joinLinkExpiryAsHours?: number;
}

export class MeetingConfig {
  @ApiProperty()
  jitsiConfig: JitsiConfig;

  @ApiProperty()
  privacyConfig: PrivacyConfig;
}

export type JitsiConfigKey = keyof JitsiConfig;
export type PrivacyConfigKey = keyof PrivacyConfig;

export type MeetingKey = keyof MeetingConfig;
