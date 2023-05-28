const { ApiError } = require('../helpers/errorHandler');
/**
 * @typedef {object} ValidationError
 * @property {string} error Error message
 */

/**
 * Middleware factory for imput data validation
 * @param {string} dataSource Request input data property name to validate
 * @param {Object} schema Joi object module validation schema
 */
module.exports = (dataSource, schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req[dataSource]);
    next();
  } catch (error) {
    next(new ApiError(error.details[0].message, { statusCode: 400 }));
  }
};
