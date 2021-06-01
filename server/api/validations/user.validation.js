const { param } = require('express-validator');

module.exports = {
  // GET /v1/user/invite/:tenantId/:email
  inviteUser: [
    param('email', 'Email is required').exists(),
    param('email', 'Email is invalid')
      .exists()
      .isEmail(),
    param('tenantId', 'Tenant id is required').exists(),
    param('tenantId', 'Tenant id must be integer').isNumeric(),
  ]
};
