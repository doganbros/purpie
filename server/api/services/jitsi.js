const IRepo = require('../repositories/iRepo');
const User = require('../models/user');
const Tenant = require('../models/tenant');
const Meeting = require('../models/meeting');
const authErrors = require('../utils/customErrors/authErrors');
const meetingError = require('../utils/customErrors/meetingError');
const tenantError = require('../utils/customErrors/tenantError');
const { generateAccessToken } = require('./tokenGenerator');

const generateJitsiToken = async (userId, meetingId, body) => {
  const userRepo = new IRepo(User);
  const user = await userRepo.findOneByField(userId, 'id');

  if (!user) throw authErrors.ACCESS_DENIED;

  const meetingRepo = new IRepo(Meeting);
  const meeting = await meetingRepo.findOneByField(meetingId, 'id');
  if (!meeting) throw meetingError.MEETING_NOT_FOUND;

  const tenantRepo = new IRepo(Tenant);
  const tenant = await tenantRepo.findOneByField(meeting.tenantId, 'id');
  if (!tenant) throw tenantError.TENANT_NOT_FOUND;

  const payload = {
    aud: tenant.aud,
    context: {
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        avatar: user.avatar,
        email: user.email,
        moderator: body?.moderator ? 'true' : 'false',
      },
      group: body?.group,
      features: {
        livestreaming: body?.livestreaming ? 'true' : 'false',
        'outbound-call': body?.outboundCall ? 'true' : 'false',
        transcription: body?.transcription ? 'true' : 'false',
        recording: body?.recording ? 'true' : 'false',
      },
    },
    iss: tenant.iss,
    // nbf: body.nbf,
    room: meeting.title.replace(' ', '-'),
    // sub: body.sub,
  };
  return generateAccessToken(payload, process.env.JITSI_SECRET, 1696284052);
};

module.exports = { generateJitsiToken };
