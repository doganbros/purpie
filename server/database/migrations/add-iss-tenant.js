module.exports = {
  up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Tenants', // table name
        'iss', // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: 'iss is required' },
          },
          defaultValue:'123'
        }
      ),
      queryInterface.addColumn(
        'Tenants', // table name
        'aud', // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: { msg: 'aud is required' },
          },
          defaultValue:'123'
        }
      ),
    ]);
  },

  down: function (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('Tenants', 'iss'),
      queryInterface.removeColumn('Tenants', 'aud'),
    ]);
  },
};
