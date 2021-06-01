const User = require('../models/user');
const Tenant = require('../models/tenant');
const IRepo = require('../repositories/iRepo');
const userErrors = require('../utils/customErrors/userErrors');
const tenantError = require('../utils/customErrors/tenantError');
const authErrors = require('../utils/customErrors/authErrors');
const mailer = require('../services/mailer');
const _ = require('lodash');


/**
 *  Update user
 * @public
 */
 exports.update = async (req, res, next) => {
  try {
    const userRepo = new IRepo(User);
    let user = await userRepo.findOneByField(req.user.id, 'id');
    if (!user) throw authErrors.USER_NOT_FOUND;

    user.firstName = req.body.firstName
    user.lastName = req.body.lastName
    user.isActive = req.body.isActive
    user.userMeetingConfigs = req.body.userMeetingConfigs

    await userRepo.updateOneById(req.user.id, user);
    user = await userRepo.findOneByField(req.user.id, 'id');

    return res.json(
      _.pick(user, [
        'firstName',
        'lastName',
        'email',
        'isActive',
        'userMeetingConfigs',
      ])
    )
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
 * Send invite new user email
 * @public
 */
exports.inviteUser = async (req, res, next) => {
  try {
    const { email, tenantId } = req.params;
    const userRepo = new IRepo(User);
    const user = await userRepo.findOneByField(email, 'email');
    if (user) throw userErrors.USER_EXIST;

    const tenantRepo = new IRepo(Tenant);
    let tenant = await tenantRepo.findOneByField(tenantId, 'id');
    if (!tenant) throw tenantError.TENANT_NOT_FOUND;

    const link = `${req.protocol}://${req.hostname}/register`;
    await mailer(
      email,
      `Invitation to ${tenant.name} Tenant`,
      `<div>Click the link below to register into ${tenant.name} Tenant</div><br/>
      <div>${link}</div>`
    );
    res.json({ message: 'Email successfully sent' });
  } catch (e) {
    next(e);
  }
};
