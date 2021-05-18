const { ApiError } = require('./baseError');

exports.USER_EXIST = new ApiError({
  message: "User is already exist",
  status: 400,
  name: 'USER_EXIST',
});