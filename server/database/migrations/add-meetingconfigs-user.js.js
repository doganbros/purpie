module.exports = {
  up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // table name
        'userMeetingConfigs', // new field name
        {
          type: Sequelize.JSON,
          defaultValue: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
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
            disableAudioLevels: false,
            audioLevelsInterval: 200,
          },
        }
      ),
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([queryInterface.removeColumn('Users', 'userMeetingConfigs')]);
  },
};
