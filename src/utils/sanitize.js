const sanitizeUser = (user) => {
  const sanitized = user.toObject ? user.toObject() : user;
  delete sanitized.password;
  delete sanitized.refreshToken;
  delete sanitized.__v;
  return sanitized;
};

const sanitizeUsers = (users) => {
  return users.map((user) => sanitizeUser(user));
};

module.exports = {
  sanitizeUser,
  sanitizeUsers,
};
