const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { TOKEN_TYPES } = require('./constants');

const generateToken = (userId, type = TOKEN_TYPES.ACCESS) => {
  const secret = type === TOKEN_TYPES.ACCESS ? env.jwt.accessSecret : env.jwt.refreshSecret;
  const expiresIn =
    type === TOKEN_TYPES.ACCESS ? env.jwt.accessExpiration : env.jwt.refreshExpiration;

  return jwt.sign({ userId, type }, secret, { expiresIn });
};

const verifyToken = (token, type = TOKEN_TYPES.ACCESS) => {
  const secret = type === TOKEN_TYPES.ACCESS ? env.jwt.accessSecret : env.jwt.refreshSecret;
  return jwt.verify(token, secret);
};

const generateAuthTokens = (userId) => {
  const accessToken = generateToken(userId, TOKEN_TYPES.ACCESS);
  const refreshToken = generateToken(userId, TOKEN_TYPES.REFRESH);

  return {
    accessToken,
    refreshToken,
  };
};

module.exports = {
  generateToken,
  verifyToken,
  generateAuthTokens,
};
