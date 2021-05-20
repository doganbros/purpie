const jwt = require('jsonwebtoken');
const { SECRET_STRING, AUTH_TOKEN_LIFE } = process.env;
module.exports = {
  generateAccessToken: (user, secret,exp=null) =>
    jwt.sign(
      user.aud?
      user
        : user? {
            id: user.id,
            email: user.email,
            roles: user.roles
          }
        : {},
      !secret ? SECRET_STRING : secret,
      {
        expiresIn: exp?exp : AUTH_TOKEN_LIFE,
      }
    ),
};
