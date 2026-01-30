const logger = require('../config/logger');

const escapeHtml = (value) => {
  if (typeof value !== 'string') {
    return value;
  }
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

const sanitizeObject = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return typeof obj === 'string' ? escapeHtml(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  Object.keys(obj).forEach((key) => {
    if (key.startsWith('$') || key.includes('.')) {
      const sanitizedKey = key.replace(/[$.]/g, '_');
      sanitized[sanitizedKey] = sanitizeObject(obj[key]);
    } else {
      sanitized[key] = sanitizeObject(obj[key]);
    }
  });

  return sanitized;
};

const sanitize = () => {
  return (req, res, next) => {
    try {
      if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
      }
      if (req.query && typeof req.query === 'object') {
        req.query = sanitizeObject(req.query);
      }
      if (req.params && typeof req.params === 'object') {
        req.params = sanitizeObject(req.params);
      }
      next();
    } catch (err) {
      logger.error('Error in sanitize middleware:', err);
      next(err);
    }
  };
};

module.exports = { sanitize };
