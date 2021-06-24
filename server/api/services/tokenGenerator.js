const jwt = require('jsonwebtoken');

const { SECRET_STRING, AUTH_TOKEN_LIFE } = process.env;
module.exports = {
  generateAccessToken: (user, secret, exp = null) => {
    let payload = {};

    if (user.aud) payload = user;
    else if (user) {
      payload.id = user.id;
      payload.email = user.email;
      payload.roles = user.roles;
    }

    return jwt.sign(payload, !secret ? SECRET_STRING : secret, {
      expiresIn: exp || AUTH_TOKEN_LIFE,
    });
  },
};
