const User = require('../models/user');
const Tenant = require('../models/tenant');
const IRepo = require('../repositories/iRepo');
const userErrors = require('../utils/customErrors/userErrors');
const tenantError = require('../utils/customErrors/tenantError');
const mailer = require('../services/mailer');

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
