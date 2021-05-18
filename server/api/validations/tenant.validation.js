const { body, param } = require('express-validator');

module.exports = {
  // POST /v1/tenant
  createTenant: [
    body('name', 'Name must be at least 2 chars long').isLength({
      min: 2,
    }),
    body('apiKey', 'apiKey is required').exists(),
    body('secret', 'secret is required').exists(),
  ],

  // GET /v1/tenant/:tenantId
  getTenant: [param('tenantId', 'Tenant id must be integer').isInt()],

  // PATCH /v1/tenant/:tenantId
  updateTenant: [
    body('name', 'Name must be at least 2 chars long').isLength({
      min: 2,
    }),
    param('tenantId', 'Tenant id is required').exists(),
    param('tenantId', 'Tenant id must be integer').isInt(),
  ],
};
