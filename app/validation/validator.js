const { ApiError } = require('../helpers/errorHandler');

module.exports = (dataSource, schema) => async (req, res, next) => {
  const { error } = await schema.validate(req[dataSource], { abortEarly: false });

  if (error) {
    const err = new ApiError(error.details[0].message, { statusCode: 400 });
    return res.status(400).json({ error: err.message });
  }
  return next();
};
