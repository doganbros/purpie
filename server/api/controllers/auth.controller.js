const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { default: Axios } = require('axios');
const { Op } = require('sequelize');
const { stringify: stringifyQuery } = require('querystring');
const User = require('../models/user');
const Tenant = require('../models/tenant');
const IRepo = require('../repositories/iRepo');
const authErrors = require('../utils/customErrors/authErrors');
const tenantError = require('../utils/customErrors/tenantError');
const { generateAccessToken } = require('../services/tokenGenerator');
const { decodeToken } = require('../services/tokenDecode');
const mailer = require('../services/mailer');
const authenticate = require('../middlewares/authenticate');
const { ApiError } = require('../utils/customErrors/baseError');

/**
 * Generate response with auth tokens
 * @private
 */
const authResponse = async (req, res, next) => {
  try {
    const accessToken = generateAccessToken(req.user);

    res.json({
      accessToken,
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
};

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = [
  async (req, res, next) => {
    if (req.skipRegister) return next();
    try {
      const subdomain = req.headers['app-subdomain'];

      if (subdomain) {
        const tenantRepo = new IRepo(Tenant);
        const tenant = await tenantRepo.findOneByField(
          `${subdomain}.jadmin.com`,
          'subdomain'
        );
        if (!tenant) throw tenantError.TENANT_DOMAIN_NOT_FOUND;

        req.user.tenantIds = [tenant.id];
        req.user.roles[tenant.id] = 3;
      }
      const userRepo = new IRepo(User);

      const usersCount = await userRepo.countAll();

      if (usersCount === 0)
        req.body.roles = {
          all: 1,
        };
      const user = await userRepo.create(req.body);
      await mailer(
        user.email,
        'Welcome Message',
        '<strong>Thank you for sign up!</strong>'
      );
      req.user = _.pick(user, [
        'id',
        'firstName',
        'lastName',
        'email',
        'roles',
        'tenantIds',
      ]);
      return next();
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
  },
  authResponse,
];

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = [
  async (req, __, next) => {
    try {
      const subdomain = req.headers['app-subdomain'];
      let tenant;

      if (subdomain) {
        const tenantRepo = new IRepo(Tenant);
        tenant = await tenantRepo.findOneByField(
          `${subdomain}.jadmin.com`,
          'subdomain'
        );
        if (!tenant) throw tenantError.TENANT_DOMAIN_NOT_FOUND;
      }
      const { email, password } = req.body;
      const userRepo = new IRepo(User);
      let user;
      if (tenant)
        user = await userRepo.findOneByMultipleFields({
          email,
          tenantIds: { [Op.contains]: [tenant?.id] },
        });
      else user = await userRepo.findOneByField(email, 'email');

      if (!user) throw authErrors.USER_NOT_FOUND;

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw authErrors.INVALID_CREDENTIALS;

      req.user = _.pick(user, [
        'id',
        'firstName',
        'lastName',
        'email',
        'roles',
      ]);
      return next();
    } catch (e) {
      return next(e);
    }
  },
  authResponse,
];

/**
 * Delete refresh token
 * @public
 */
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await User.update(
      { refreshToken: null },
      { where: { 'refreshToken.token': refreshToken }, limit: 1 }
    );
  }

  res.status(httpStatus.NO_CONTENT).send();
};

/**
 * Send reset password email
 * @public
 */
exports.reset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userRepo = new IRepo(User);
    const user = await userRepo.findOneByField(email, 'email');
    if (!user) throw authErrors.USER_NOT_FOUND;

    const token = generateAccessToken(user, 'RESET_PASSWORD_JADMIN');
    user.token = token;
    await userRepo.updateOneById(user.id, user);
    const link = `${req.protocol}://${process.env.UI_HOST}/reset-password/${token}`;
    await mailer(
      email,
      'Reset Password',
      `<div>Click the link below to reset your password</div><br/>
      <div>${link}</div>`
    );
    res.json({ message: 'Email successfully sent' });
  } catch (e) {
    next(e);
  }
};

/**
 * Change password after reset
 * @public
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = await decodeToken(token, 'RESET_PASSWORD_JADMIN');
    if (!decoded) throw authErrors.INVALID_TOKEN;

    const userRepo = new IRepo(User);
    const user = await userRepo.findOneByField(decoded.email, 'email');
    if (!user) throw authErrors.USER_NOT_FOUND;

    if (token !== user.token) throw authErrors.INVALID_TOKEN;
    user.password = await bcrypt.hash(password, 10);
    user.token = null;
    await userRepo.updateOneById(user.id, user);
    res.json({ message: 'Password is updated successfully' });
  } catch (e) {
    next(e);
  }
};

/**
 * retrieve user data
 * @public
 */
exports.retrieveUser = [
  authenticate(),
  async (req, res, next) => {
    try {
      const { email } = req.user;
      const userRepo = new IRepo(User);
      let user = await userRepo.findOneByField(email, 'email');
      if (!user) throw authErrors.USER_NOT_FOUND;

      user = _.pick(user, ['id', 'firstName', 'lastName', 'email', 'role']);
      res.json({ user });
    } catch (err) {
      next(err);
    }
  },
];

/**
 * Returns accessToken if valid API Key and secret is provided
 * @public
 */
exports.generateToken = async (req, res, next) => {
  try {
    const tenantRepo = new IRepo(Tenant);
    const tenant = await tenantRepo.findOneByField(req.query.api_key, 'apiKey');
    if (!tenant) throw authErrors.INVALID_DATA;

    const isMatch = await bcrypt.compare(req.query.secret, tenant.secret);
    if (!isMatch) throw authErrors.INVALID_DATA;

    const accessToken = generateAccessToken({
      id: tenant.id,
    });
    return res.json({ accessToken });
  } catch (err) {
    return next(err);
  }
};

exports.generateThirdPartyUrl = async (req, res, next) => {
  try {
    const { name } = req.params;

    if (name === 'google') {
      const stringifiedQuery = stringifyQuery({
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        redirect_uri: `${process.env.UI_HOST}/auth/google`,
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' '), // space seperated string
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
      });

      return res.json({
        url: `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedQuery}`,
      });
    }

    if (name === 'facebook') {
      const stringifiedQuery = stringifyQuery({
        client_id: process.env.FACEBOOK_OAUTH_CLIENT_ID,
        redirect_uri: `${process.env.UI_HOST}/auth/facebook`,
        scope: ['email', 'public_profile'].join(','),
        response_type: 'code',
        auth_type: 'rerequest',
      });

      return res.json({
        url: `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedQuery}`,
      });
    }

    return res.sendStatus(404);
  } catch (err) {
    return next(err);
  }
};

exports.authenticateFromThirdPartyCode = [
  async (req, res, next) => {
    try {
      const { name } = req.params;
      const { code } = req.body;

      if (name === 'google') {
        const {
          data: { accessToken },
        } = await Axios({
          url: `https://oauth2.googleapis.com/token`,
          method: 'post',
          data: {
            client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
            client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            redirect_uri: `${process.env.UI_HOST}/auth/google`,
            grant_type: 'authorization_code',
            code,
          },
        });

        const { data } = await Axios({
          url: 'https://www.googleapis.com/oauth2/v2/userinfo',
          method: 'get',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userRepo = new IRepo(User);
        const user = await userRepo.findOneByMultipleFields({
          [Op.or]: [{ email: data.email }, { googleId: data.id }],
        });

        if (user) {
          if (!user.googleId)
            await userRepo.updateOneById(user.id, {
              dataValues: { googleId: data.id },
            });
          req.user = _.pick(user, [
            'id',
            'firstName',
            'lastName',
            'email',
            'roles',
          ]);
          req.skipRegister = true;
          return next();
        }

        req.body = {
          firstName: data.given_name,
          lastName: data.family_name,
          email: data.email,
          googleId: data.id,
          isActive: true,
        };
        return next();
      }

      if (name === 'facebook') {
        const {
          data: { accessToken },
        } = await Axios({
          url: 'https://graph.facebook.com/v4.0/oauth/access_token',
          method: 'get',
          params: {
            client_id: process.env.FACEBOOK_OAUTH_CLIENT_ID,
            client_secret: process.env.FACEBOOK_OAUTH_CLIENT_SECRET,
            redirect_uri: `${process.env.UI_HOST}/auth/facebook`,
            code,
          },
        });

        const { data } = await Axios({
          url: 'https://graph.facebook.com/me',
          method: 'get',
          params: {
            fields: [
              'id',
              'email',
              'first_name',
              'last_name',
              'middle_name',
            ].join(','),
            accessToken,
          },
        });

        const userRepo = new IRepo(User);
        const user = await userRepo.findOneByMultipleFields({
          [Op.or]: [{ email: data.email }, { facebookId: data.id }],
        });

        if (user) {
          if (!user.facebookId)
            await userRepo.updateOneById(user.id, {
              dataValues: { facebookId: data.id },
            });
          req.user = _.pick(user, [
            'id',
            'firstName',
            'lastName',
            'email',
            'roles',
          ]);
          req.skipRegister = true;
          return next();
        }

        req.body = {
          firstName:
            data.first_name + (data.middle_name ? ` ${data.middle_name}` : ''),
          lastName: data.last_name,
          email: data.email,
          facebookId: data.id,
          isActive: true,
        };
        return next();
      }

      return res.sendStatus(404);
    } catch (err) {
      return next(err);
    }
  },
  exports.register,
];
