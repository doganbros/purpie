const router = require('express').Router();
const validate = require('../../validations/handler');
const controller = require('../../controllers/auth.controller');
const rules = require('../../validations/auth.validation');

/**
 * @api {get} v1/auth generateToken
 * @apiDescription Generate token using Tenant API KEY and secret
 * @apiVersion 1.0.0
 * @apiName GenerateToken
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}                 api_key      Tenant's apiKey
 * @apiParam  {String{6..22}}          secret       Tenant's secret
 *
 * @apiSuccess (Success 200) {String}  accesstoken   Access Token's type
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Bad Request 403)  Forbidden  api_key or secret is invalid
 */
router.route('/').get(validate(rules.generateToken), controller.generateToken);

/**
 * @api {post} v1/auth/register Register
 * @apiDescription Register a new user
 * @apiVersion 1.0.0
 * @apiName Register
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}                 email      User's email
 * @apiParam  {String{6..22}}          password   User's password
 * @apiParam  {String}                 firstName User's first name
 * @apiParam  {String}                 lastName  User's last name
 *
 * @apiSuccess (Success 200) {String}  token.auth     Access Token's type
 * @apiSuccess (Success 200) {String}  token.refresh  Token to get a new accessToken
 *                                                    after expiration time
 *
 * @apiSuccess (Success 200) {String}  user.id         User's id
 * @apiSuccess (Success 200) {String}  user.name       User's name
 * @apiSuccess (Success 200) {String}  user.email      User's email
 * @apiSuccess (Success 200) {String}  user.role       User's role
 * @apiSuccess (Success 200) {Date}    user.createdAt  Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 */

router.post('/register', controller.register);
/**
 * @api {post} v1/auth/login Login
 * @apiDescription Get an accessToken
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}         email     User's email
 * @apiParam  {String}  password  User's password
 *
 * @apiSuccess (Success 200) {String}  token.auth     Access Token's type
 * @apiSuccess (Success 200) {String}  token.refresh  Token to get a new accessToken
 *                                                    after expiration time
 *
 * @apiSuccess (Success 200) {String}  user.id         User's id
 * @apiSuccess (Success 200) {String}  user.name       User's name
 * @apiSuccess (Success 200) {String}  user.email      User's email
 * @apiSuccess (Success 200) {String}  user.role       User's role
 * @apiSuccess (Success 200) {Date}    user.createdAt  Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or password
 */
router.route('/login').post(validate(rules.login), controller.login);
/**
 * @api {get} v1/auth/retrieve Retrieve
 * @apiDescription Retrieve User From An Access Token
 * @apiVersion 1.0.0
 * @apiName Retreive
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiSuccess (Success 200) {String}  user.id         User's id
 * @apiSuccess (Success 200) {String}  user.name       User's name
 * @apiSuccess (Success 200) {String}  user.email      User's email
 * @apiSuccess (Success 200) {String}  user.role       User's role
 * @apiSuccess (Success 200) {Date}    user.createdAt  Timestamp
 *
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or password
 */
router.route('/retrieve').post(controller.retrieveUser);

/**
 * @api {post} v1/auth/logout Logout
 * @apiDescription Delete user's refresh token
 * @apiVersion 1.0.0
 * @apiName Logout
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}   refreshToken     User's refresh token
 *
 * @apiSuccess (Success 204)
 */
// router.route('/logout').post(controller.logout);

/**
 * @api {post} v1/auth/refresh-token Refresh Token
 * @apiDescription Refresh expired accessToken
 * @apiVersion 1.0.0
 * @apiName RefreshToken
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  refreshToken  Refresh token required when user logged in
 *
 * @apiSuccess (Success 200) {String}  token.auth     Access Token's type
 * @apiSuccess (Success 200) {String}  token.refresh  Token to get a new accessToken
 *                                                    after expiration time
 *
 * @apiSuccess (Success 200) {String}  user.id         User's id
 * @apiSuccess (Success 200) {String}  user.name       User's name
 * @apiSuccess (Success 200) {String}  user.email      User's email
 * @apiSuccess (Success 200) {String}  user.role       User's role
 * @apiSuccess (Success 200) {Date}    user.createdAt  Timestamp
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or refreshToken
 */
// router
//   .route('/refresh-token')
//   .post(validate(rules.refresh), controller.refresh);

router
  .route('/reset-password')
  /**
   * @api {post} v1/auth/reset-password Reset password
   * @apiDescription Send reset password email
   * @apiVersion 1.0.0
   * @apiName ResetPassword
   * @apiGroup Auth
   * @apiPermission public
   *
   * @apiParam  {String}  email         User's email
   *
   * @apiSuccess (Success 200) {String}  message    Success message
   *
   * @apiError (Bad Request 400)  ValidationError   Can't find user with this email
   */
  .post(validate(rules.email), controller.reset)
  /**
   * @api {put} v1/auth/reset-password Reset password
   * @apiDescription Set new password after reset
   * @apiVersion 1.0.0
   * @apiName ResetPassword
   * @apiGroup Auth
   * @apiPermission public
   *
   * @apiParam  {String}  id          User's id
   * @apiParam  {String}  resetToken Reset token
   * @apiParam  {String}  password    New user password
   *
   * @apiSuccess (Success 200) {String}  message    Success message
   *
   * @apiError (Bad Request 400)  ValidationError   Can't find user with this email
   */
  .put(validate(rules.changePassword), controller.changePassword);


  router
    .route('/third-party/:name')
     /**
   * @api {get} v1/auth/third-party/:name Generate Third Party URL (Google, Facebook)
   * @apiDescription Send third party URL
   * @apiVersion 1.0.0
   * @apiName GenerateUrl
   * @apiGroup Auth
   * @apiPermission public
   *
   *
   * @apiSuccess {String}  url           Generated URL
   * @apiError (Bad Request 400)  NotImplemented   Authentication for this name is not implemented yet
   *
   */
  .get(validate(rules.thirdParty), controller.generateThirdPartyUrl)
  /**
   * @api {post} v1/auth/third-party/:name Authenticate From third-party code
   * @apiDescription set new user after been authenticated by third party
   * @apiVersion 1.0.0
   * @apiName AuthenticateFromThirdPartyCode
   * @apiGroup Auth
   * @apiPermission public
   *
   * @apiParam  {String}  code          Authentication Code
   *
   * @apiSuccess (Success 200) {String}  message    Success message
   *
   * @apiError (Bad Request 400)  NotImplemented   Authentication for this name is not implemented yet
   */
  .post(validate(rules.thirdParty), controller.authenticateFromThirdPartyCode)


module.exports = router;
