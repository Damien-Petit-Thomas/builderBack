require('dotenv').config();

const logger = require('../../helpers/logger');
const { type } = require('../../models/index.datamapper');
const { ApiError } = require('../../helpers/errorHandler');

module.exports = {

  async getAllTypes(_, res) {
    try {
      const types = await type.findAll();
      if (!types) throw new ApiError('an error occured while fetching data', { statusCode: 500 });
      if (types.length === 0) throw new ApiError('No types found', { statusCode: 404 });
      return res.json(types);
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.infos);
    }
  },
  async getNoDamageFrom(req, res) {
    const { id } = req.params;
    try {
      const imune = await type.findNoDamageFrom(id);
      if (!imune) throw new ApiError('an error occured while fetching data', { statusCode: 500 });
      return res.json(imune);
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.infos);
    }
  },

  async getHalfDamageFrom(req, res) {
    const { id } = req.params;
    try {
      const resist = await type.findHalfDamageFrom(id);
      if (!resist) throw new ApiError('an error occured while fetching data', { statusCode: 500 });
      return res.json(resist);
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.infos);
    }
  },
  async getNoDamageFromAndHalfDamageFrom(req, res) {
    const { id } = req.params;
    try {
      const result = await type.findNoDamageFromAndHalfDamageFrom(id);
      if (!result) throw new ApiError('an error occured while fetching data', { statusCode: 500 });
      return res.json(result);
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.infos);
    }
  },
  async getDoubleDamageFrom(req, res) {
    const { id } = req.params;
    try {
      const typeName = await type.findByPk(id);
      if (!typeName) throw new ApiError('No type found', { statusCode: 404 });
      const weak = await type.findDoubleDamageFrom(typeName.id);
      if (!weak) throw new ApiError('an error occured while fetching data', { statusCode: 500 });
      return res.json(weak);
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.infos);
    }
  },
  async getResistanceToTypeList(req, res) {
    const types = req.body;
    try {
      const result = await type.findResistanceToTypeList(types);
      if (!result) throw new ApiError('an error occured while fetching data', { statusCode: 500 });
      if (result.length === 0) throw new ApiError('No type found', { statusCode: 404 });
      return res.json(result);
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.infos);
    }
  },

  async getTypeById(req, res) {
    const { id } = req.params;
    if (!id) throw new ApiError('No id provided', { statusCode: 400 });
    try {
      const result = await type.findByPk(id);
      if (!result) throw new ApiError('an error occured while fetching data', { statusCode: 500 });
      if (result.length === 0) throw new ApiError('No type found', { statusCode: 404 });
      return res.json(result);
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.infos);
    }
  },

};
