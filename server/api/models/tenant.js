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
