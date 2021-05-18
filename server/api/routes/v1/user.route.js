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
module.exports = router;
