const sanitize = require('sanitize-html');
const { type } = require('../../models');
const { ApiError } = require('../../helpers/errorHandler');
const typeCache = require('../../utils/cache/type.cache').getInstance();
const inCache = require('../../utils/cache/inCache');

module.exports = {

  async getAllTypes(_, res) {
    const cache = inCache('allType', typeCache);
    if (cache) return res.json(cache);
    const types = await type.findAll();
    if (!types) throw new ApiError('an error occured while fetching data', { statusCode: 500 });
    if (types.length === 0) throw new ApiError('No types found', { statusCode: 404 });
    console.log('not in cache');
    typeCache.set('allType', types, typeCache.TTL);
    return res.json(types);
  },
  async getNoDamageFrom(req, res) {
    const { id } = req.params;

    const imune = await type.findNoDamageFrom(id);
    if (!imune) throw new ApiError('an error occured while fetching data', { statusCode: 500 });
    return res.json(imune);
  },

  async getHalfDamageFrom(req, res) {
    const { id } = req.params;

    const resist = await type.findHalfDamageFrom(id);
    if (!resist) throw new ApiError('an error occured while fetching data', { statusCode: 500 });
    return res.json(resist);
  },
  async getNoDamageFromAndHalfDamageFrom(req, res) {
    const { id } = req.params;

    const result = await type.findNoDamageFromAndHalfDamageFrom(id);
    if (!result) throw new ApiError('an error occured while fetching data', { statusCode: 500 });
    return res.json(result);
  },
  async getDoubleDamageFrom(req, res) {
    const { id } = req.params;

    const typeName = await type.findByPk(id);
    if (!typeName) throw new ApiError('No type found', { statusCode: 404 });
    const weak = await type.findDoubleDamageFrom(typeName.id);
    if (!weak) throw new ApiError('an error occured while fetching data', { statusCode: 500 });
    return res.json(weak);
  },
  async getResistanceToTypeList(req, res) {
    const types = sanitize(req.body.types);

    const result = await type.findResistanceToTypeList(types);
    if (!result) throw new ApiError('an error occured while fetching data', { statusCode: 500 });
    if (result.length === 0) throw new ApiError('No type found', { statusCode: 404 });
    return res.json(result);
  },

  async getTypeById(req, res) {
    const { id } = req.params;

    if (!id) throw new ApiError('No id provided', { statusCode: 400 });

    const result = await type.findByPk(id);
    if (!result) throw new ApiError('an error occured while fetching data', { statusCode: 500 });
    if (result.length === 0) throw new ApiError('No type found', { statusCode: 404 });
    return res.json(result);
  },

};
