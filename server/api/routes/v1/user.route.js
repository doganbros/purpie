const express = require('express');
const validate = require('../../validations/handler');
const controller = require('../../controllers/user.controller');
const rules = require('../../validations/user.validation');

const router = express.Router();

router
  .route('/invite/:tenantId/:email')
  /**
   * @api {get} v1/user/invite/:tenantId/:email inviteUser
   * @apiDescription Invite user to specific tenant using email and tenant id
   * @apiVersion 1.0.0
   * @apiName InviteUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiParam  {String}                 email      invited user's email
   * @apiParam  {String{6..22}}          tenantId       Tenant's id
   *
   * @apiSuccess (OK 200)  Email successfully sent
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values or email is exist
   * @apiError (Bad Request 404)  NotFound  Tenant is not exist
   */
  .get(validate(rules.inviteUser), controller.inviteUser);

router
  .route('')
  /**
   * @api {patch} v1/user Update User
   * @apiDescription Update some fields of a tenant document
   * @apiVersion 1.0.0
   * @apiName UpdateUser
   * @apiGroup User
   * @apiPermission user
   *
   * @apiHeader {String} Authorization User's access token
   *
   * @apiParam  {String}              firstName             User's firstName
   * @apiParam  {String}              lastName              User's lastName
   * @apiParam  {String}              userMeetingConfigs    User's userMeetingConfigs
   * @apiSuccess {Boolean}            isActive              User's isActive
   *
   * @apiSuccess {String}  id                 User's id
   * @apiSuccess {String}  firstName          User's firstName
   * @apiSuccess {String}  lastName           User's lastName
   * @apiSuccess {String}  email              User's email
   * @apiSuccess {String}  userMeetingConfigs User's userMeetingConfigs
   * @apiSuccess {String}  isActive           User's isActive
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Forbidden 403)    Forbidden    same user can modify the data
   * @apiError (Not Found 404)    NotFound     user does not exist
   */
  .patch(controller.update);

module.exports = router;
