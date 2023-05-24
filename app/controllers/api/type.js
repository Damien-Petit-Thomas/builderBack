require('dotenv').config();

const logger = require('../../helpers/logger');
const { type } = require('../../models/index.datamapper');
const { ApiError } = require('../../helpers/errorHandler');

module.exports = {

  async getAllTypes(_, res) {
    try {
      const types = await type.findAll();
      if (!types) throw new ApiError('No types found', { statusCode: 404, isPublic: true });
      return res.json(types);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: 'An error occurred' });
    }
  },
  async getNoDamageFrom(req, res) {
    const { id } = req.params;
    try {
      const imune = await type.findNoDamageFrom(id);
      return res.json(imune);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: 'An error occurred' });
    }
  },
  async getHalfDamageFrom(req, res) {
    const { id } = req.params;
    try {
      const resist = await type.findHalfDamageFrom(id);
      return res.json(resist);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: 'An error occurred' });
    }
  },
  async getNoDamageFromAndHalfDamageFrom(req, res) {
    const { id } = req.params;
    try {
      const result = await type.findNoDamageFromAndHalfDamageFrom(id);
      return res.json(result);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: 'An error occurred' });
    }
  },
  async getDoubleDamageFrom(req, res) {
    const { id } = req.params;
    try {
      const typeName = await type.findByPk(id);
      if (!typeName) throw new ApiError('No type found', { statusCode: 404, isPublic: true });
      const weak = await type.findDoubleDamageFrom(typeName.id);
      return res.json(weak);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: 'An error occurred' });
    }
  },
  async getResistanceToTypeList(req, res) {
    const types = req.body;
    try {
      const result = await type.findResistanceToTypeList(types);
      return res.json(result);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: 'An error occurred' });
    }
  },

  async getTypeById(req, res) {
    const { id } = req.params;
    try {
      const result = await type.findByPk(id);
      if (!result) throw new ApiError('No type found', { statusCode: 404, isPublic: true });
      return res.json(result);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ error: 'An error occurred' });
    }
  },

};
