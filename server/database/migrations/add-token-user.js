module.exports = {
  up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'Users', // table name
        'token', // new field name
        {
          type: Sequelize.STRING,
          defaultValue: null
        }
      )
    ])
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'token')
  }
}
