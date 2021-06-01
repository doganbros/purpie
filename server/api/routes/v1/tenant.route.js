const express = require('express');
const validate = require('../../validations/handler');
const controller = require('../../controllers/tenant.controller');
const rules = require('../../validations/tenant.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {get} v1/tenant List Tenants
   * @apiDescription Get a list of tenants
   * @apiVersion 1.0.0
   * @apiName ListTenants
   * @apiGroup Tenant
   * @apiPermission superadmin
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiSuccess List of Tenants.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(validate(controller.list))
  /**
   * @api {post} v1/users Create Tenant
   * @apiDescription Create a new tenant
   * @apiVersion 1.0.0
   * @apiName CreateTenant
   * @apiGroup Tenant
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}              name         Tenant's name
   * @apiParam  {String}              description  Tenant's description
   * @apiParam  {String}              website      Tenant's website
   * @apiParam  {String}              apiKey       Tenant's apiKey
   * @apiParam  {String}              secret       Tenant's secret
   * @apiParam  {String}              iss          Tenant's iss
   * @apiParam  {String}              aud          Tenant's aud
   *
   * @apiSuccess {String}  id           Tenant's id
   * @apiSuccess {String}  name         Tenant's name
   * @apiSuccess {String}  subdomain    Tenant's subdomain
   * @apiSuccess {String}  website      Tenant's website
   * @apiSuccess {String}  description  Tenant's description
   * @apiSuccess {Boolean} active       Tenant's active
   * @apiSuccess {Integer} adminId      Tenant's adminId
   * @apiSuccess {Date}    createdAt    Timestamp
   * @apiSuccess {String}  iss          Tenant's iss
   * @apiSuccess {String}  aud          Tenant's aud
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
  .post(validate(rules.createTenant), controller.create);

router
  .route('/:tenantId&:subdomain')
  /**
   * @api {get} v1/tenantId/:tenantId&:subdomain Get Tenant
   * @apiDescription Get tenant information
   * @apiVersion 1.0.0
   * @apiName GetTenant
   * @apiGroup Tenant
   * @apiPermission user
   *
   * @apiHeader {String} Authorization tenant's access token
   *
   * @apiSuccess {String}  id           Tenant's id
   * @apiSuccess {String}  name         Tenant's name
   * @apiSuccess {String}  subdomain    Tenant's subdomain
   * @apiSuccess {String}  website      Tenant's website
   * @apiSuccess {String}  description  Tenant's description
   * @apiSuccess {Boolean} active       Tenant's active
   * @apiSuccess {Integer} adminId      Tenant's adminId
   * @apiSuccess {Date}    createdAt    Timestamp
   * @apiSuccess {String}  iss          Tenant's iss
   * @apiSuccess {String}  aud          Tenant's aud
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Tenant does not exist
   */
  .get(validate(rules.getTenant), controller.get);

router
  .route('/:tenantId')
  /**
   * @api {patch} v1/tenant/:tenantId Update Tenant
   * @apiDescription Update some fields of a tenant document
   * @apiVersion 1.0.0
   * @apiName UpdateTenant
   * @apiGroup Tenant
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization User's access token
   *
   * @apiParam  {String}              name         Tenant's name
   * @apiParam  {String}              description  Tenant's description
   * @apiParam  {String}              website      Tenant's website
   * @apiSuccess {Boolean}            active       Tenant's active
   *
   * @apiSuccess {String}  id           Tenant's id
   * @apiSuccess {String}  name         Tenant's name
   * @apiSuccess {String}  subdomain    Tenant's subdomain
   * @apiSuccess {String}  website      Tenant's website
   * @apiSuccess {String}  description  Tenant's description
   * @apiSuccess {Boolean} active       Tenant's active
   * @apiSuccess {Integer} adminId      Tenant's adminId
   * @apiSuccess {Date}    createdAt    Timestamp
   * @apiSuccess {String}  iss          Tenant's iss
   * @apiSuccess {String}  aud          Tenant's aud
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Forbidden 403)    Forbidden    Only  admins can modify the data
   * @apiError (Not Found 404)    NotFound     Tenant does not exist
   */
  .patch(validate(rules.updateTenant), controller.update)
  /**
   * @api {patch} v1/tenant/:tenantId Delete Tenant
   * @apiDescription Delete a tenant
   * @apiVersion 1.0.0
   * @apiName DeleteTenant
   * @apiGroup Tenant
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization User's access token
   *
   * @apiSuccess (OK 200)  Successfully deleted
   *
   * @apiError (Forbidden 403)    Forbidden    Only  admins can modify the data
   * @apiError (Not Found 404)    NotFound      Tenant does not exist
   */
  .delete(validate(rules.getTenant), controller.delete);

module.exports = router;
