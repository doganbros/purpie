const { body } = require('express-validator');

module.exports = {
  // POST /v1/role
  createRole: [
    body('name', 'Name must be at least 2 chars long').isLength({
      min: 2,
    }),
    body('permissions', 'Permissions is required').exists(),
    body('permissions', 'Permissions type must be array').isArray(),
  ],
};
