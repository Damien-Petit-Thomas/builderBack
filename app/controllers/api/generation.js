const { gen } = require('../../models');
const logger = require('../../helpers/logger');
const { ApiError } = require('../../helpers/errorHandler');

module.exports = {
  async getAllGenerations(req, res) {
    try {
      const generations = await gen.findAll();
      if (!generations) throw new ApiError('No generations found', { statusCode: 404 });
      res.status(200).json(generations);
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.infos);
    }
  },
};
