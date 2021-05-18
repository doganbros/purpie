const { body, param } = require('express-validator');

module.exports = {
  // POST /v1/meeting
  createMeeting: [
    body('title', 'Title must be at least 2 chars long').isLength({
      min: 2,
    }),
    body('startDate', 'startDate is required').exists(),
    body('startDate', 'startDate date is invalid').matches(
      /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/
    ),
    body('endDate', 'endDate is required').exists(),
    body('endDate', 'endDate date is invalid').matches(
      /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/
    ),
    body('tenantId', 'Tenant id is required').exists(),
    body('tenantId', 'Tenant id must be integer').isInt(),
  ],

  // GET /v1/meeting/:tenantId/:meetingId
  getMeeting: [
    param('tenantId', 'Tenant id is required').exists(),
    param('tenantId', 'Tenant id must be integer').isNumeric(),
    param('meetingId', 'Meeting id is required').exists(),
    param('meetingId', 'Meeting id must be integer').isNumeric(),
  ],

  // GET /v1/meeting/:tenantId
  listMeetings: [param('tenantId', 'Tenant id must be integer').isNumeric()],

  // PATCH /v1/meeting/:meetingId
  updateMeeting: [
    body('title', 'Title must be at least 2 chars long').isLength({
      min: 2,
    }),
    body('startDate', 'startDate is required').exists(),
    body('startDate', 'startDate date is invalid').matches(
      /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/
    ),
    body('endDate', 'startDate is required').exists(),
    body('endDate', 'endDate date is invalid').matches(
      /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/
    ),
    param('meetingId', 'Meeting id is required').exists(),
    param('meetingId', 'Meeting id must be integer').isInt(),
  ],

  // DELETE /v1/meeting/:meetingId
  deleteMeeting: [
    param('meetingId', 'Meeting id is required').exists(),
    param('meetingId', 'Meeting id must be integer').isInt(),
  ],
};
