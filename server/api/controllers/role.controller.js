const httpStatus = require('http-status');
const Role = require('../models/role');
const IRepo = require('../repositories/iRepo');
const _ = require('lodash');

/**
 *  Create new Role
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const roleRepo = new IRepo(Role);
    const role = await roleRepo.create(
      _.pick(req.body, ['name', 'permissions'])
    );
    res.status(httpStatus.CREATED).json(role);
  } catch (e) {
    return next(e);
  }
};

/**
 * Get role list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const roleRepo = new IRepo(Role);
    const roles = await roleRepo.findAll();
    return res.json(roles);
  } catch (e) {
    next(e);
  }
};
