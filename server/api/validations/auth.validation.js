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

  // Get /v1/auth/jitsi
  generateJitsiToken: [
    body('aud', 'aud is required').exists(),
    body('aud', 'aud must be string').isString(),
    body('iss', 'iss is required').exists(),
    body('iss', 'iss must be string').isString(),
    body('sub', 'sub is required').exists(),
    body('sub', 'sub must be string').isString(),  
    body('room', 'room is required').exists(),
    body('room', 'room must be string').isString(),
    body('exp', 'exp is required').exists(),
    body('exp', 'exp must be integer').isInt(),
    body('avatar', 'avatar is required').exists(),
    body('avatar', 'avatar must be string').isString(), 
    body('name', 'name is required').exists(),
    body('name', 'name must be string').isString(), 
    body('email', 'email is required').exists(),
    body('email', 'email must be string').isString(), 
    body('id', 'id is required').exists(),
    body('id', 'id must be string').isString()
  ],

  // GET /v1/auth/third-party/:name
  thirdParty: [
    param('name', 'Authentication for this name has not been implemented yet').isIn(['google', 'facebook'])
  ]
};
