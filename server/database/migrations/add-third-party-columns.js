module.exports = {
    up (queryInterface, Sequelize) {
      return Promise.all([
        queryInterface.addColumn(
          'Users', // table name
          'googleId', // new field name
          {
            type: Sequelize.STRING,
            defaultValue: null
          }
        ),
        queryInterface.addColumn(
          'Users', // table name
          'facebookId', // new field name
          {
            type: Sequelize.STRING,
            defaultValue: null
          }
        )
      ])
    },
  
    down: function (queryInterface) {
        return Promise.all([
            queryInterface.removeColumn('Users', 'googleId'),
            queryInterface.removeColumn('Users', 'facebookId')
        ]);
    }
  }
  