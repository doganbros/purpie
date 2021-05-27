const httpStatus = require('http-status');
const Meeting = require('../models/meeting');
const Tenant = require('../models/tenant');
const User = require('../models/user');
const IRepo = require('../repositories/iRepo');
const mailer = require('../services/mailer');
const _ = require('lodash');
const meetingError = require('../utils/customErrors/meetingError');
const tenantError = require('../utils/customErrors/tenantError');
const authErrors = require('../utils/customErrors/authErrors');
const { generateJitsiToken } = require('../services/jitsi');

/**
 *  Create new meeting
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const tenantRepo = new IRepo(Tenant);
    const tenant = await tenantRepo.findOneByField(req.body.tenantId, 'id');
    if (!tenant) throw tenantError.TENANT_NOT_FOUND;

    if (req.user.subdomain && tenant.id != req.user.subdomain)
      throw authErrors.ACCESS_DENIED;
    const userRepo = new IRepo(User);
    const user = await userRepo.findOneByField(
      req.user.id == -1 ? tenant.adminId : req.user.id,
      'id'
    );

    if (
      !user.roles.all &&
      !user.tenantIds.includes(parseInt(req.body.tenantId))
    ) {
      throw authErrors.ACCESS_DENIED;
    }

    req.body.creatorId = req.user.id;

    const meetingRepo = new IRepo(Meeting);
    const meeting = await meetingRepo.create(
      _.pick(req.body, [
        'title',
        'description',
        'startDate',
        'endDate',
        'tenantId',
        'creatorId',
      ])
    );
    meeting.link = `${tenant.subdomain}/${meeting.title.replace(' ', '-')}`;
    await meetingRepo.updateOneById(meeting.id, meeting);

    mailer(
      req.user.email,
      'Meeting created successfully!',
      `<strong>Welcome, you are the host of ${req.body.title}</strong>`
    );
    return res.status(httpStatus.CREATED).json(meeting);
  } catch (e) {
    return next(e);
  }
};

/**
 *  Update meeting
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const meetingRepo = new IRepo(Meeting);
    const meeting = await meetingRepo.findOneByField(
      req.params.meetingId,
      'id'
    );
    if (!meeting) {
      throw meetingError.MEETING_NOT_FOUND;
    }

    const tenantRepo = new IRepo(Tenant);
    const tenant = await tenantRepo.findOneByField(meeting.tenantId, 'id');

    if (req.user.subdomain && tenant.id != req.user.subdomain)
      throw authErrors.ACCESS_DENIED;

    if (req.user.id != -1) {
      const userRepo = new IRepo(User);
      const user = await userRepo.findOneByField(req.user.id, 'id');

      if (
        !user.roles.all &&
        (!user.tenantIds.includes(meeting.tenantId) ||
          (meeting.creatorId !== user.id && user.id !== tenant.adminId))
      ) {
        throw authErrors.ACCESS_DENIED;
      }
    }

    meeting.title = req.body.title;
    meeting.description = req.body.description;
    meeting.startDate = req.body.startDate;
    meeting.endDate = req.body.endDate;

    await meetingRepo.updateOneById(req.params.meetingId, meeting);
    return res.json(meeting);
  } catch (e) {
    return next(e);
  }
};

/**
 * Get meeting list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const { tenantId } = req.params;
    const userRepo = new IRepo(User);
    const user = await userRepo.findOneByField(req.user.id, 'id');
    if (tenantId != -1) {
      const tenantRepo = new IRepo(Tenant);
      const tenant = await tenantRepo.findOneByField(tenantId, 'id');
      if (!tenant) throw tenantError.TENANT_NOT_FOUND;

      if (req.user.id != -1) {
        if (!user.roles.all && !user.tenantIds.includes(parseInt(tenantId))) {
          throw authErrors.ACCESS_DENIED;
        }
      }
    } else if (req.user.id == -1) {
      throw authErrors.ACCESS_DENIED;
    }
    const meetingRepo = new IRepo(Meeting);
    let meetings = [];
    if (!user.roles.all || (tenantId != -1 && user.roles.all)) {
      // api key user, admin or user get their all meetings or meetings by specific tenant
      // or superadmin get meetings by specific tenant
      meetings = await meetingRepo.findAllByField(
        req.user.subdomain
          ? req.user.subdomain
          : tenantId != -1
          ? tenantId
          : user.tenantIds,
        'tenantId'
      );
    } else if (tenantId == -1 && user.roles.all)
      // superadmin gets all meetings
      meetings = await meetingRepo.findAll();
    return res.json(meetings);
  } catch (e) {
    next(e);
  }
};

/**
 * Get meeting
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const userRepo = new IRepo(User);
    const user = await userRepo.findOneByField(req.user.id, 'id');

    const tenantRepo = new IRepo(Tenant);
    const tenant = await tenantRepo.findOneByField(req.params.tenantId, 'id');
    if (!tenant) throw tenantError.TENANT_NOT_FOUND;

    if (req.user.subdomain && tenant.id != req.user.subdomain)
      throw authErrors.ACCESS_DENIED;

    if (
      !user.roles.all &&
      !user.tenantIds.includes(parseInt(req.params.tenantId))
    ) {
      throw authErrors.ACCESS_DENIED;
    }
    const generalRepo = new IRepo(Meeting);
    const meeting = await generalRepo.findOneByField(
      req.params.meetingId,
      'id'
    );

    if (!meeting || meeting.tenantId != req.params.tenantId)
      throw meetingError.MEETING_NOT_FOUND;

    return res.json(meeting);
  } catch (e) {
    next(e);
  }
};

/**
 * Delete meeting
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    const meetingRepo = new IRepo(Meeting);
    const meeting = await meetingRepo.findOneByField(
      req.params.meetingId,
      'id'
    );
    if (!meeting) {
      throw meetingError.MEETING_NOT_FOUND;
    }

    const tenantRepo = new IRepo(Tenant);
    const tenant = await tenantRepo.findOneByField(meeting.tenantId, 'id');

    if (req.user.subdomain && tenant.id != req.user.subdomain)
      throw authErrors.ACCESS_DENIED;

    if (req.user.id != -1) {
      const userRepo = new IRepo(User);
      const user = await userRepo.findOneByField(req.user.id, 'id');

      if (
        !user.roles.all &&
        (!user.tenantIds.includes(meeting.tenantId) ||
          (meeting.creatorId !== user.id && user.id !== tenant.adminId))
      ) {
        throw authErrors.ACCESS_DENIED;
      }
    }
    await meetingRepo.delete(meeting);
    res.status(httpStatus.OK).json({ result: 'delete' });
  } catch (e) {
    next(e);
  }
};

/**
 *  Join meeting
 * @public
 */
exports.join = async (req, res, next) => {
  try {
    const meetingRepo = new IRepo(Meeting);
    const meeting = await meetingRepo.findOneByField(
      req.params.meetingId,
      'id'
    );
    if (!meeting) throw meetingError.MEETING_NOT_FOUND;
    const jitsiToken = await generateJitsiToken(
      req.user?.id,
      meeting.id,
      req.body
    );
    let configs = '#';

    Object.keys(req.body).map(key => {
      configs += `config.${key}=${encodeURIComponent(JSON.stringify(req.body[key]))}&`;
    });
    const roomLink = `https://${meeting.link}?jwt=${jitsiToken}${configs}`;

    return res.status(httpStatus.OK).json({ roomLink });
  } catch (e) {
    return next(e);
  }
};

/**
 * Returns jitsiToken
 * @public
 */
exports.jitsiToken = async (req, res, next) => {
  try {
    const jitsiToken = await generateJitsiToken(
      req.user?.id,
      req.params?.meetingId,
      req.body
    );

    res.json({ jitsiToken });
  } catch (err) {
    next(err);
  }
};
