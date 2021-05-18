const { ApiError } = require('./baseError');

exports.TENANT_NOT_FOUND = new ApiError({
  message: "Can't find tenant with this id",
  status: 400,
  name: 'TENANT_NOT_FOUND',
});
exports.TENANT_DOMAIN_NOT_FOUND = new ApiError({
  message: "Can't find tenant with this subdomain",
  status: 400,
  name: 'TENANT_DOMAIN_NOT_FOUND',
});