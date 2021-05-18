module.exports = {
  up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Tenants', // table name
        'apiKey', // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: 'apiKey is required' },
          },
        }
      ),
      queryInterface.addColumn(
        'Tenants', // table name
        'secret', // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: 'Secret is required' },
          },
        }
      ),
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Tenants', 'apiKey'),
      queryInterface.removeColumn('Tenants', 'secret'),
    ]);
  },
};
