const jwt = require('jsonwebtoken');

const decodeToken = (token, secret) => {
  try {
    const decoded = jwt.verify(
      token,
      !secret ? process.env.SECRET_STRING : secret,
      {
        expiresIn: process.env.AUTH_TOKEN_LIFE,
      }
    );
    return decoded;
  } catch (e) {
    return false;
  }
};
module.exports = { decodeToken };
