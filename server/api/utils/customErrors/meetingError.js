const { ApiError } = require('./baseError');

exports.MEETING_NOT_FOUND = new ApiError({
  message: "Can't find meeting with this id",
  status: 400,
  name: 'MEETING_NOT_FOUND',
});
