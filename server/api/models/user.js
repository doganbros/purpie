const bcrypt = require('bcryptjs');
const { omit } = require('lodash');
const DataTypes = require('sequelize');
const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    defaultValue: '',
    validate: {
      notEmpty: { msg: 'First Name is required' },
    },
  },
  lastName: {
    type: DataTypes.STRING,
    defaultValue: '',
    validate: {
      notEmpty: { msg: 'Last Name is required' },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
    unique: { msg: 'Email already exists' },
    validate: {
      notEmpty: { msg: 'Email is required' },
      isEmail: { msg: 'Email is not valid' },
    },
  },
  password: {
    type: DataTypes.STRING,
    defaultValue: null,
    validate: {
      isValidPassword (value) {
        if (
          !(value && value.length >= 6) &&
          !(this.googleId && this.facebookId)
        )
          throw new Error('Password should be at least 6 chars');
      },
    },
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  facebookId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  roles: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  tenantIds: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    defaultValue: null,
  },
  isActive: {
    defaultValue: false,
    type: DataTypes.BOOLEAN,
  },
  token: {
    defaultValue: false,
    type: DataTypes.STRING,
  },
  userMeetingConfigs: {
    type: DataTypes.JSON,
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
  },
});

/** Models Hooks */
User.beforeSave(async user => {
  try {
    if (user._changed.email) {
      user.email = user.email.toLowerCase();
    }
    if (user._changed.password || user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    return user;
  } catch (error) {
    return sequelize.Promise.reject(error);
  }
});

/** Static methods */

/**
 * Return count of all users and rows with offset
 * @param page
 * @param limit
 * @returns {Promise<*>}
 */
User.paginate = async function paginate (page = 1, limit = 10) {
  const offset = limit * (page - 1);
  const result = await this.findAndCountAll({ limit, offset });
  result.rows.map(user => user.transform());
  return result;
};

/** Object methods */
const objectMethods = {
  /**
   * Prepare object to serialization
   * @returns {Object}
   */
  transform () {
    return omit(this.get({ plain: true }), [
      'password',
      'refreshToken',
      'resetToken',
    ]);
  },
};

User.prototype = Object.assign(User.prototype, objectMethods);
module.exports = User;
