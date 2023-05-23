const { gen } = require('../../models/index.datamapper');
const logger = require('../../helpers/logger');

module.exports = {
  async getAllGenerations(req, res) {
    try {
      const generations = await gen.findAll();
      res.json(generations);
    } catch (err) {
      logger.error(err);
      res.status(500).json(err);
    }
  },
};
