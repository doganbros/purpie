const Role = require('../models/role');
const IRepo = require('../repositories/iRepo');
const authErrors = require('../utils/customErrors/authErrors');

const hasPermission = async (roles, permission, tenantId = null) => {
  if (roles && roles.all) {
    return { superadmin: true };
  }
  if (!roles[tenantId]) throw authErrors.ACCESS_DENIED;
  const roleRepo = new IRepo(Role);
  const role = await roleRepo.findOneByField(roles[tenantId.toString()], 'id');

  if (!role) throw authErrors.ROLE_ID_INVALID;
  else if (!role.permissions.includes(permission))
    throw authErrors.ACCESS_DENIED;

  return { allowed: true };
};

module.exports = { hasPermission };
