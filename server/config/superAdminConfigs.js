module.exports.superAdminConfigs = {
  //* *** Audio

  // Disable measuring of audio levels.
  disableAudioLevels: false,
  audioLevelsInterval: 200,

  // Enabling this will run the lib-jitsi-meet no audio detection module which
  // will notify the user if the current selected microphone has no audio
  // input and will suggest another valid device if one is present.
  enableNoAudioDetection: true,

  // Enabling this will run the lib-jitsi-meet noise detection module which will
  // notify the user if there is noise, other than voice, coming from the current
  // selected microphone. The purpose it to let the user know that the input could
  // be potentially unpleasant for other meeting participants.
  enableNoisyMicDetection: true,

  // Start the conference in audio only mode (no video is being received nor
  // sent).
  startAudioOnly: false,

  // Every participant after the Nth will start audio muted.
  startAudioMuted: 10,

  // Start calls with audio muted. Unlike the option above, this one is only
  // applied locally. FIXME: having these 2 options is confusing.
  startWithAudioMuted: false,

  //* *** Video

  // Every participant after the Nth will start video muted.
  startVideoMuted: 10,

  // Start calls with video muted. Unlike the option above, this one is only
  // applied locally. FIXME: having these 2 options is confusing.
  startWithVideoMuted: false,

  //* *** Desktop sharing

  // Try to start calls with screen-sharing instead of camera video.
  startScreenSharing: false,

  //* *** Recording

  // Whether to enable file recording or not.
  fileRecordingsEnabled: false,

  // Whether to enable live streaming or not.
  liveStreamingEnabled: false,

  //* *** UI

  // Disables responsive tiles.
  disableResponsiveTiles: false,

  // Hides lobby button
  hideLobbyButton: false,

  // Require users to always specify a display name.
  requireDisplayName: true,

  // Default language for the user interface.
  defaultLanguage: 'en',

  // Disables profile and the edit of all fields from the profile settings (display name and email)
  disableProfile: false,

  // When enabled the password used for locking a room is restricted to up to the number of digits specified
  // roomPasswordNumberOfDigits: 10,
  roomPasswordNumberOfDigits: false,

  // When 'true', it shows an intermediate page before joining, where the user can configure their devices.
  prejoinPageEnabled: false,

  // If true, shows the unsafe room name warning label when a room name is
  // deemed unsafe (due to the simplicity in the name) and a password is not
  // set or the lobby is not enabled.
  enableInsecureRoomNameWarning: false,

  // Whether to automatically copy invitation URL after creating a room.
  // Document should be focused for this option to work
  enableAutomaticUrlCopy: false,

  // App name to be displayed in the invitation email subject, as an alternative to
  // interfaceConfig.APP_NAME.
  inviteAppName: null,

  // Moved from interfaceConfig(TOOLBAR_BUTTONS).
  // The name of the toolbar buttons to display in the toolbar, including the
  // "More actions" menu. If present, the button will display. Exceptions are
  // "livestreaming" and "recording" which also require being a moderator and
  // some other values in config.js to be enabled. Also, the "profile" button will
  // not display for users with a JWT.
  // Notes:
  // - it's impossible to choose which buttons go in the "More actions" menu
  // - it's impossible to control the placement of buttons
  // - 'desktop' controls the "Share your screen" button
  // - if `toolbarButtons` is undefined, we fallback to enabling all buttons on the UI
  toolbarButtons: [
    'microphone',
    'camera',
    'closedcaptions',
    'desktop',
    'embedmeeting',
    'fullscreen',
    'fodeviceselection',
    'hangup',
    'profile',
    'chat',
    'recording',
    'livestreaming',
    'etherpad',
    'sharedvideo',
    'shareaudio',
    'settings',
    'raisehand',
    'videoquality',
    'filmstrip',
    'invite',
    'feedback',
    'stats',
    'shortcuts',
    'tileview',
    'select-background',
    'download',
    'help',
    'mute-everyone',
    'mute-video-everyone',
    'security',
  ],

  // Decides whether the start/stop recording audio notifications should play on record.
  disableRecordAudioNotification: false,

  // Disables the sounds that play when other participants join or leave the
  // conference (if set to true, these sounds will not be played).
  disableJoinLeaveSounds: false,

  // If set to true all muting operations of remote participants will be disabled.
  disableRemoteMute: true,

  // Hides the conference subject
  hideConferenceSubject: false,

  // Hides the conference timer.
  hideConferenceTimer: true,

  // Hides the participants stats
  hideParticipantsStats: true,

  // Sets the conference subject
  subject: 'Conference Subject',
};
