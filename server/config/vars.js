const path = require('path');

// import .env variables
require('dotenv').config({
  path: path.join(__dirname, '../../.env'),
});

module.exports = {
  ...process.env,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
};
