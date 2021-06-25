const { validationResult } = require('express-validator');
const httpStatus = require('http-status');
const flatten = require('flat');

module.exports = (rules) => [
  rules,
  (req, res, next) => {
    let validationErrors = validationResult(req);
    if (validationErrors.isEmpty()) return next();
    validationErrors = validationErrors.mapped();
    let errors = [];
    for (const key in validationErrors) {
      // eslint-disable-next-line no-prototype-builtins
      if (validationErrors.hasOwnProperty(key)) {
        errors.push(validationErrors[key].msg);
      }
    }
    errors = flatten.unflatten(errors, { save: true });
    return res.status(httpStatus.BAD_REQUEST).json({
      message: errors,
      name: 'VALIDATOR_ERROR',
    });
  },
];
