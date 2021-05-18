const httpStatus = require('http-status');
const User = require('../models/user');
const Tenant = require('../models/tenant');
const IRepo = require('../repositories/iRepo');
const { ApiError } = require('../utils/customErrors/baseError');
const { authErrors } = require('../utils/customErrors/authErrors');
const tenantError = require('../utils/customErrors/tenantError');
const { decodeToken } = require('../services/tokenDecode');
const _ = require('lodash');
const { Op } = require('sequelize');
const { HOST } = process.env;
// const roles = {
//   admin: ['guest', 'user'],
//   user: ['guest'],
//   guest: []
// }

const invalidToken = {
  message: 'Invalid token',
  status: httpStatus.UNAUTHORIZED,
};
// const userBlocked = {
//   message: 'User is blocked',
//   status: httpStatus.UNAUTHORIZED
// }
// const noPermissions = {
//   message: 'Access denied',
//   status: httpStatus.FORBIDDEN,
// };

// function hasPermissions (userRole, allowedRole) {
//   return (
//     userRole in roles &&
//     (userRole === allowedRole || roles[userRole].includes(allowedRole))
//   )
// }

module.exports = () => async (req, res, next) => {
  let decoded = null;
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    decoded = await decodeToken(token);
    if (!decoded) return next(new ApiError(invalidToken));
  } catch (error) {
    return next(new ApiError(invalidToken));
  }
  if (decoded.email) {
    const subdomain = req.hostname.split('.')[0];
    let tenant;
    if (subdomain !== HOST) {
      const tenantRepo = new IRepo(Tenant);
      tenant = await tenantRepo.findOneByField(
        `${subdomain}.jadmin.com`,
        'subdomain'
      );

      if (!tenant)
        return next(new ApiError(tenantError.TENANT_DOMAIN_NOT_FOUND));
    }

    const userRepo = new IRepo(User);
    let user;
    if (tenant) {
      user = await userRepo.findOneByMultipleFields({
        ['id']: decoded.id,
        ['tenantIds']: { [Op.contains]: [tenant?.id] },
      });
      if (!user) throw authErrors.USER_NOT_FOUND;
      user.subdomain = tenant.id;
    } else user = await userRepo.findOneByField(decoded.id, 'id');

    req.user = _.pick(user, ['email', 'id', 'roles', 'subdomain']);
  } else {
    req.user = { id: -1, roles: { [decoded.id]: 2 } };
  }
  return next();
};
