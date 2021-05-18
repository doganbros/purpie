module.exports = {
    up (queryInterface, Sequelize) {
      return Promise.all([
        queryInterface.changeColumn(
          'Users',
          'password',
          {
            type: Sequelize.STRING,
            defaultValue: null
          }
        )
      ])
    },
  
    down: function (queryInterface, Sequelize) {
      return queryInterface.changeColumn('Users', 'password', {type: Sequelize.STRING, defaultValue: ''})
    }
  }
  