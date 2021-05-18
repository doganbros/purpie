'use strict';
module.exports = {
  up: async function (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      {
        name: 'superadmin',
        permissions: [
          'GET_ALL_TENANTS', // superadmin
          'UPDATE_TENANT', // admin
          'DELETE_TENANT', // admin
          'CREATE_ROLE', // superadmin
          'NORMAL_USER', // user
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'admin',
        permissions: [
          'UPDATE_TENANT', // admin
          'DELETE_TENANT', // admin
          'NORMAL_USER', // user
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'user',
        permissions: ['NORMAL_USER'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async function (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles');
  },
};
