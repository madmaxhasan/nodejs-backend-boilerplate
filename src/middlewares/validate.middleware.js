const { error, HTTP_STATUS } = require('../utils/response');

const validate = (schema) => {
  return (req, res, next) => {
    const validationTarget = {
      body: req.body,
      query: req.query,
      params: req.params,
    };

    const result = schema.safeParse(validationTarget);

    if (!result.success) {
      const errors =
        result.error?.issues?.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        })) || [];

      return next(error(HTTP_STATUS.UNPROCESSABLE_ENTITY, 'Validation failed', errors));
    }

    req.validated = result.data;
    next();
  };
};

module.exports = { validate };
