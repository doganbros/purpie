const { body, query, param } = require('express-validator');
const emailNormalizeRules = require('../utils/emailNormalizeRules');

module.exports = {
  // POST /v1/auth/login
  login: [
    body('email', 'Email is invalid')
      .exists({ checkFalsy: true })
      .isEmail()
      .normalizeEmail(emailNormalizeRules),
    body('password', 'Password is required').exists({ checkFalsy: true }),
  ],
  // POST /v1/auth/reset-password
  email: [
    body('email', 'Email is invalid')
      .exists()
      .isEmail(),
  ],
  changePassword: [
    body('password', 'Password is required').exists({ checkFalsy: true }),
  ],

  // Get /v1/auth
  generateToken: [
    query('api_key', 'api_key is required').exists({}),
    query('secret', 'secret is required').exists({}),
  ],

  // GET /v1/auth/third-party/:name
  thirdParty: [
    param('name', 'Authentication for this name has not been implemented yet').isIn(['google', 'facebook'])
  ]
};
