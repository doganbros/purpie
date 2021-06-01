module.exports = {
  up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Tenants', // table name
        'tenantMeetingConfigs', // new field name
        {
          type: Sequelize.JSON,
          defaultValue: {
            disableAudioLevels: false,
            audioLevelsInterval: 200,
            startAudioOnly: false,
            startAudioMuted: 10,
            startWithAudioMuted: false,
            startVideoMuted: 10,
            startWithVideoMuted: false,
            startScreenSharing: false,
            fileRecordingsEnabled: false,
            liveStreamingEnabled: false,
            requireDisplayName: true,
            defaultLanguage: 'en',
            prejoinPageEnabled: false,
            inviteAppName: null,
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
            hideConferenceSubject: false,
            hideConferenceTimer: true,
            hideParticipantsStats: true,
            subject: 'Conference Subject',
            disableJoinLeaveSounds: false,
          },
        }
      ),
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Tenants', 'tenantMeetingConfigs'),
    ]);
  },
};
