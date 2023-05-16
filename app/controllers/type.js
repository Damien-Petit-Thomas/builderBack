require('dotenv').config();

const logger = require('../helpers/logger');
const { type } = require('../models/index.datamapper');

module.exports = {

  async getAllTypes(_, res) {
    const types = await type.findAll();
    res.json(types);
  },

};
