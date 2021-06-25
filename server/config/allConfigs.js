module.exports = [
  {
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

    // Enabling it (with #params) will disable local audio output of remote
    // participants and to enable it back a reload is needed.
    startSilent: false,

    // Specify audio quality stereo and opusMaxAverageBitrate values in order to enable HD audio.
    // Beware, by doing so, you are disabling echo cancellation, noise suppression and AGC.
    audioQuality: {
      stereo: false,
      opusMaxAverageBitrate: null, // Value to fit the 6000 to 510000 range.
    },

    //* *** Video

    // Sets the preferred resolution (height) for local video. Defaults to 720.
    resolution: 720,

    // How many participants while in the tile view mode, before the receiving video quality is reduced from HD to SD.
    // Use -1 to disable.
    maxFullResolutionParticipants: -1,

    // w3c spec-compliant video constraints to use for video capture. Currently
    // used by browsers that return true from lib-jitsi-meet's
    // util#browser#usesNewGumFlow. The constraints are independent from
    // this config's resolution value. Defaults to requesting an ideal
    // resolution of 720p.
    constraints: {
      video: {
        height: {
          ideal: 720,
          max: 720,
          min: 240,
        },
      },
    },

    // Every participant after the Nth will start video muted.
    startVideoMuted: 10,

    // Start calls with video muted. Unlike the option above, this one is only
    // applied locally. FIXME: having these 2 options is confusing.
    startWithVideoMuted: false,

    // If set to true, prefer to use the H.264 video codec (if supported).
    // Note that it's not recommended to do this because simulcast is not
    // supported when  using H.264. For 1-to-1 calls this setting is enabled by
    // default and can be toggled in the p2p section.
    // This option has been deprecated, use preferredCodec under videoQuality section instead.
    preferH264: true,

    // If set to true, disable H.264 video codec by stripping it out of the
    // SDP.
    disableH264: false,

    //* *** Desktop sharing

    // Optional desktop sharing frame rate options. Default value: min:5, max:5.
    desktopSharingFrameRate: {
      min: 5,
      max: 5,
    },

    // Try to start calls with screen-sharing instead of camera video.
    startScreenSharing: false,

    //* *** Recording

    // Whether to enable file recording or not.
    fileRecordingsEnabled: false,

    // Whether to enable live streaming or not.
    liveStreamingEnabled: false,

    // Transcription (in interface_config,
    // subtitles and buttons can be configured)
    transcribingEnabled: false,

    // Enables automatic turning on captions when recording is started
    autoCaptionOnRecord: false,

    //* *** UI

    // Disables responsive tiles.
    disableResponsiveTiles: false,

    // Hides lobby button
    hideLobbyButton: false,

    // Require users to always specify a display name.
    requireDisplayName: true,

    // Whether to use a welcome page or not. In case it's false a random room
    // will be joined when no room is specified.
    enableWelcomePage: true,

    // Disable app shortcuts that are registered upon joining a conference
    // disableShortcuts: false,

    // Disable initial browser getUserMedia requests.
    // This is useful for scenarios where users might want to start a conference for screensharing only
    // disableInitialGUM: false,

    // Enabling the close page will ignore the welcome page redirection when
    // a call is hangup.
    // enableClosePage: false,

    // Disable hiding of remote thumbnails when in a 1-on-1 conference call.
    // disable1On1Mode: false,

    // Default language for the user interface.
    // defaultLanguage: 'en',

    // Disables profile and the edit of all fields from the profile settings (display name and email)
    // disableProfile: false,

    // Whether or not some features are checked based on token.
    // enableFeaturesBasedOnToken: false,

    // When enabled the password used for locking a room is restricted to up to the number of digits specified
    // roomPasswordNumberOfDigits: 10,
    roomPasswordNumberOfDigits: false,

    // Message to show the users. Example: 'The service will be down for
    // maintenance at 01:00 AM GMT,
    // noticeMessage: '',

    // Enables calendar integration, depends on googleApiApplicationClientID
    // and microsoftApiApplicationClientID
    enableCalendarIntegration: false,

    // When 'true', it shows an intermediate page before joining, where the user can configure their devices.
    prejoinPageEnabled: false,

    // If etherpad integration is enabled, setting this to true will
    // automatically open the etherpad when a participant joins.  This
    // does not affect the mobile app since opening an etherpad
    // obscures the conference controls -- it's better to let users
    // choose to open the pad on their own in that case.
    openSharedDocumentOnJoin: false,

    // If true, shows the unsafe room name warning label when a room name is
    // deemed unsafe (due to the simplicity in the name) and a password is not
    // set or the lobby is not enabled.
    enableInsecureRoomNameWarning: false,

    // Whether to automatically copy invitation URL after creating a room.
    // Document should be focused for this option to work
    enableAutomaticUrlCopy: false,

    // Base URL for a Gravatar-compatible service. Defaults to libravatar.
    // gravatarBaseURL: 'https://seccdn.libravatar.org/avatar/',

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

    //* *** Privacy

    // If third party requests are disabled, no other server will be contacted.
    // This means avatars will be locally generated and callstats integration
    // will not function.
    disableThirdPartyRequests: false,

    /**
   External API url used to receive branding specific information.
   If there is no url set or there are missing fields, the defaults are applied.
   The config file should be in JSON.
   None of the fields are mandatory and the response must have the shape:
   {
       // The domain url to apply (will replace the domain in the sharing conference link/embed section)
       inviteDomain: 'example-company.org,
       // The hex value for the colour used as background
       backgroundColor: '#fff',
       // The url for the image used as background
       backgroundImageUrl: 'https://example.com/background-img.png',
       // The anchor url used when clicking the logo image
       logoClickUrl: 'https://example-company.org',
       // The url used for the image used as logo
       logoImageUrl: 'https://example.com/logo-img.png'
   }
  */
    // dynamicBrandingUrl: '',

    // Sets the background transparency level. '0' is fully transparent, '1' is opaque.
    // backgroundAlpha: 1,

    // The URL of the moderated rooms microservice, if available. If it
    // is present, a link to the service will be rendered on the welcome page,
    // otherwise the app doesn't render it.
    // moderatedRoomServiceUrl: 'https://moderated.jitsi-meet.example.com',

    // If true, tile view will not be enabled automatically when the participants count threshold is reached.
    // disableTileView: true,

    // Hides the conference subject
    // hideConferenceSubject: true,

    // Hides the conference timer.
    // hideConferenceTimer: true,

    // Hides the participants stats
    // hideParticipantsStats: true,

    // Sets the conference subject
    // subject: 'Conference Subject',

    // This property is related to the use case when jitsi-meet is used via the IFrame API. When the property is true
    // jitsi-meet will use the local storage of the host page instead of its own. This option is useful if the browser
    // is not persisting the local storage inside the iframe.
    // useHostPageLocalStorage: true,

    // List of undocumented settings used in jitsi-meet
    /**
   _immediateReloadThreshold
   debug
   debugAudioLevels
   deploymentInfo
   dialInConfCodeUrl
   dialInNumbersUrl
   dialOutAuthUrl
   dialOutCodesUrl
   disableRemoteControl
   displayJids
   etherpad_base
   externalConnectUrl
   firefox_fake_device
   googleApiApplicationClientID
   iAmRecorder
   iAmSipGateway
   microsoftApiApplicationClientID
   peopleSearchQueryTypes
   peopleSearchUrl
   requireDisplayName
   tokenAuthUrl
   */

    /**
     * This property can be used to alter the generated meeting invite links (in combination with a branding domain
     * which is retrieved internally by jitsi meet) (e.g. https://meet.jit.si/someMeeting
     * can become https://brandedDomain/roomAlias)
     */
    // brandingRoomAlias: null,

    // List of undocumented settings used in lib-jitsi-meet
    /**
   _peerConnStatusOutOfLastNTimeout
   _peerConnStatusRtcMuteTimeout
   abTesting
   avgRtpStatsN
   callStatsConfIDNamespace
   callStatsCustomScriptUrl
   desktopSharingSources
   disableAEC
   disableAGC
   disableAP
   disableHPF
   disableNS
   enableTalkWhileMuted
   forceJVB121Ratio
   forceTurnRelay
   hiddenDomain
   ignoreStartMuted
   websocketKeepAlive
   websocketKeepAliveUrl
   */

    /**
      Use this array to configure which notifications will be shown to the user
      The items correspond to the title or description key of that notification
      Some of these notifications also depend on some other internal logic to be displayed or not,
      so adding them here will not ensure they will always be displayed
      A falsy value for this prop will result in having all notifications enabled (e.g null, undefined, false)
  */
    notifications: [
      'connection.CONNFAIL', // shown when the connection fails,
      'dialog.cameraNotSendingData', // shown when there's no feed from user's camera
      'dialog.kickTitle', // shown when user has been kicked
      'dialog.liveStreaming', // livestreaming notifications (pending, on, off, limits)
      'dialog.lockTitle', // shown when setting conference password fails
      'dialog.maxUsersLimitReached', // shown when maximmum users limit has been reached
      'dialog.micNotSendingData', // shown when user's mic is not sending any audio
      'dialog.passwordNotSupportedTitle', // shown when setting conference password fails due to password format
      'dialog.recording', // recording notifications (pending, on, off, limits)
      'dialog.remoteControlTitle', // remote control notifications (allowed, denied, start, stop, error)
      'dialog.reservationError',
      'dialog.serviceUnavailable', // shown when server is not reachable
      'dialog.sessTerminated', // shown when there is a failed conference session
      'dialog.sessionRestarted', // show when a client reload is initiated because of bridge migration
      'dialog.tokenAuthFailed', // show when an invalid jwt is used
      'dialog.transcribing', // transcribing notifications (pending, off)
      'dialOut.statusMessage', // shown when dial out status is updated.
      'liveStreaming.busy', // shown when livestreaming service is busy
      'liveStreaming.failedToStart', // shown when livestreaming fails to start
      'liveStreaming.unavailableTitle', // shown when livestreaming service is not reachable
      'lobby.joinRejectedMessage', // shown when while in a lobby, user's request to join is rejected
      'lobby.notificationTitle', // shown when lobby is toggled and when join requests are allowed / denied
      'localRecording.localRecording', // shown when a local recording is started
      'notify.disconnected', // shown when a participant has left
      'notify.grantedTo', // shown when moderator rights were granted to a participant
      'notify.invitedOneMember', // shown when 1 participant has been invited
      'notify.invitedThreePlusMembers', // shown when 3+ participants have been invited
      'notify.invitedTwoMembers', // shown when 2 participants have been invited
      'notify.kickParticipant', // shown when a participant is kicked
      'notify.mutedRemotelyTitle', // shown when user is muted by a remote party
      'notify.mutedTitle', // shown when user has been muted upon joining,
      'notify.newDeviceAudioTitle', // prompts the user to use a newly detected audio device
      'notify.newDeviceCameraTitle', // prompts the user to use a newly detected camera
      'notify.passwordRemovedRemotely', // shown when a password has been removed remotely
      'notify.passwordSetRemotely', // shown when a password has been set remotely
      'notify.raisedHand', // shown when a partcipant used raise hand,
      'notify.startSilentTitle', // shown when user joined with no audio
      'prejoin.errorDialOut',
      'prejoin.errorDialOutDisconnected',
      'prejoin.errorDialOutFailed',
      'prejoin.errorDialOutStatus',
      'prejoin.errorStatusCode',
      'prejoin.errorValidation',
      'recording.busy', // shown when recording service is busy
      'recording.failedToStart', // shown when recording fails to start
      'recording.unavailableTitle', // shown when recording service is not reachable
      'toolbar.noAudioSignalTitle', // shown when a broken mic is detected
      'toolbar.noisyAudioInputTitle', // shown when noise is detected for the current microphone
      'toolbar.talkWhileMutedPopup', // shown when user tries to speak while muted
      'transcribing.failedToStart', // shown when transcribing fails to start
    ],

    // Allow all above example options to include a trailing comma and
    // prevent fear when commenting out the last value.
  },
];
