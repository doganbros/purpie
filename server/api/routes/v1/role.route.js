const express = require('express');
const validate = require('../../validations/handler');
const controller = require('../../controllers/role.controller');
const rules = require('../../validations/role.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} v1/role List Roles
   * @apiDescription Get a list of roles
   * @apiVersion 1.0.0
   * @apiName ListRoles
   * @apiGroup Role
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess List of Roles.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   */
  .get(validate(controller.list))
  /**
   * @api {post} v1/users Create Role
   * @apiDescription Create a new Role
   * @apiVersion 1.0.0
   * @apiName CreateRole
   * @apiGroup Role
   * @apiPermission superadmin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}              name         Role's name
   * @apiParam  {Array}               permissions  Role's permissions
   *
   * @apiSuccess {String}  id           Role's id
   * @apiSuccess {String}  name         Role's name
   * @apiSuccess {Array}  permissions  Role's permissions
   * @apiSuccess {Date}    createdAt    Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Forbidden 403)      Forbidden    Only superadmin can add the data
   */
  .post(validate(rules.createRole), controller.create);

module.exports = router;
