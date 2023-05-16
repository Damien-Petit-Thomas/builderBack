const { gen } = require('../models/index.datamapper');

module.exports = {
  async getAllGenerations(req, res) {
    const generations = await gen.findAll();
    res.json(generations);
  },
};
