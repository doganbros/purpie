const { DataTypes } = require('sequelize');

const Role = sequelize.define('Role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: { msg: 'This name is already exist' },
    validate: {
      notEmpty: {
        msg: 'name is required',
      },
    },
  },
  permissions: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
    validate: {
      notNull: {
        msg: 'permissions list is required',
      },
    },
  },
});

module.exports = Role;
