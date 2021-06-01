const bcrypt = require('bcryptjs');
const DataTypes = require('sequelize');
const Tenant = sequelize.define('Tenant', {
  name: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false,
    unique: { msg: 'This name is already exist' },
    validate: {
      notEmpty: { msg: 'Name is required' },
    },
  },
  description: {
    type: DataTypes.STRING(1024),
    defaultValue: '',
  },
  website: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  subdomain: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'subdomain is required' },
    },
  },
  active: {
    defaultValue: true,
    type: DataTypes.BOOLEAN,
  },
  adminId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Admin id is required' },
    },
  },
  apiKey: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'apiKey is required' },
    },
  },
  secret: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Secret is required' },
    },
  },
  iss: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'iss is required' },
    },
  },
  aud: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'aud is required' },
    },
  },
  tenantMeetingConfigs: {
    type: DataTypes.JSON,
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
  },
});

/** Models Hooks */
Tenant.beforeSave(async tenant => {
  try {
    if (tenant._changed.secret || tenant.secret) {
      tenant.secret = await bcrypt.hash(tenant.secret, 10);
    }
    return tenant;
  } catch (error) {
    return sequelize.Promise.reject(error);
  }
});
Tenant.prototype.toJSON = function () {
  var values = Object.assign({}, this.get());

  delete values.secret;
  delete values.apiKey;
  return values;
};
module.exports = Tenant;
