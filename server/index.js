/* eslint-disable no-console */
// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign
require('dotenv').config();

const { PORT, NODE_ENV } = process.env;
const sequelize = require('./database/db-build');
const app = require('./config/express');

sequelize.sync().then(() => {
  app.listen(PORT, () =>
    console.info(`Server started on port ${PORT} (${NODE_ENV})`)
  );
});

/**
 * Exports express
 * @public
 */
module.exports = app;
