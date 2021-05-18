const DataTypes = require('sequelize')
const Meeting = sequelize.define('Meeting', {
  title: {
    type: DataTypes.STRING,
    defaultValue: '',
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Name is required' }
    }
  },
  description: {
    type: DataTypes.STRING(1024),
    defaultValue: ''
  },
  link: {
    type: DataTypes.STRING,
    defaultValue: ''
  },

  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'startDate is required' }
    }
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'endDate is required' }
    }
  },
  creatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Creator id is required' }
    }
  },
  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Tenant id is required' }
    }
  }
})

module.exports = Meeting
