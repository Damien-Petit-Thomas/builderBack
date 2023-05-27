const { ApiError } = require('../helpers/errorHandler');

module.exports = (dataSource, schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req[dataSource], { abortEarly: false });
  } catch (error) {
    next(new ApiError(error.details[0].message, { statusCode: 400 }));
  }
};
