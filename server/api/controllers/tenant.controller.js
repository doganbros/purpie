const httpStatus = require('http-status');
const Tenant = require('../models/tenant');
const User = require('../models/user');
const IRepo = require('../repositories/iRepo');
const mailer = require('../services/mailer');
const { hasPermission } = require('../services/rolePermissions');
const _ = require('lodash');
const tenantError = require('../utils/customErrors/tenantError');
const { ApiError } = require('../utils/customErrors/baseError');

/**
 *  Create new tenant
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const tenantRepo = new IRepo(Tenant);
    req.body.adminId = req.user.id;
    req.body.subdomain =
      req.body.name.toLowerCase().replace(' ', '-') + '.jadmin.com';

    const tenant = await tenantRepo.create(
      _.pick(req.body, [
        'name',
        'description',
        'website',
        'adminId',
        'subdomain',
        'apiKey',
        'secret',
      ])
    );

    mailer(
      req.user.email,
      'Tenant created successfully!',
      `<strong>Welcome, you are the admin of ${req.body.name}</strong>`
    );
    const userRepo = new IRepo(User);
    const user = await userRepo.findOneByField(req.user.id, 'id');

    if (!user.isActive) user.isActive = true;
    user.roles[tenant.id] = 2;

    if (user.tenantIds) user.tenantIds.push(tenant.id);
    else user.tenantIds = [tenant.id];

    await userRepo.updateOneById(req.user.id, user);
    res.status(httpStatus.CREATED).json(tenant);
  } catch (e) {
    if (e.errors && e.errors[0] && e.errors[0].message)
      next(
        new ApiError({
          status: httpStatus.BAD_REQUEST,
          message: e.errors[0].message,
        })
      );
    else return next(e);
  }
};

/**
 *  Update tenant
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    await hasPermission(req.user.roles, 'UPDATE_TENANT', req.params.tenantId);
    const tenantRepo = new IRepo(Tenant);
    const tenant = await tenantRepo.findOneByField(req.params.tenantId, 'id');
    if (!tenant) throw tenantError.TENANT_NOT_FOUND;

    tenant.subdomain =
      req.body.name.toLowerCase().replace(' ', '-') + '.jadmin.com';
    tenant.name = req.body.name;
    tenant.website = req.body.website;
    tenant.active = req.body.active;
    tenant.description = req.body.description;

    await tenantRepo.updateOneById(req.params.tenantId, tenant);
    return res.json(tenant);
  } catch (e) {
    if (e.errors && e.errors[0] && e.errors[0].message)
      next(
        new ApiError({
          status: httpStatus.BAD_REQUEST,
          message: e.errors[0].message,
        })
      );
    return next(e);
  }
};

/**
 * Get tenant list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const userRepo = new IRepo(User);
    const user = await userRepo.findOneByField(req.user.id, 'id');

    let tenants;
    const generalRepo = new IRepo(Tenant);

    if (user.roles && user.roles.all) tenants = await generalRepo.findAll();
    else tenants = await generalRepo.findAllByField(user.tenantIds, 'id');
    return res.json(tenants);
  } catch (e) {
    next(e);
  }
};

/**
 * Get tenant
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    let value, field;
    if (req.params.tenantId == -1) {
      value = req.params.subdomain;
      field = 'subdomain';
    } else {
      value = req.params.tenantId;
      field = 'id';
    }
    const generalRepo = new IRepo(Tenant);
    const tenant = await generalRepo.findOneByField(value, field);
    if (!tenant) throw tenantError.TENANT_NOT_FOUND;

    const userRepo = new IRepo(User);
    const user = await userRepo.findOneByField(req.user.id, 'id');

    if (!user.tenantIds || !user.tenantIds.includes(tenant.id)) {
      if (!user.tenantIds) {
        user.tenantIds = [tenant.id];
      } else if (!user.tenantIds.includes(tenant.id)) {
        user.tenantIds.push(tenant.id);
      }
      user.roles[tenant.id] = 3;

      userRepo.updateOneById(user.id, user);
    }
    return res.json(tenant);
  } catch (e) {
    next(e);
  }
};

/**
 * Delete tenant
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    await hasPermission(req.user.roles, 'DELETE_TENANT', req.params.tenantId);

    const generalRepo = new IRepo(Tenant);
    const tenant = await generalRepo.findOneByField(req.params.tenantId, 'id');
    if (!tenant) throw tenantError.TENANT_NOT_FOUND;
    await generalRepo.delete(tenant);
    res.status(httpStatus.OK).json({ result: 'delete' });
  } catch (e) {
    next(e);
  }
};
