require('dotenv').config();

const logger = require('../../helpers/logger');
const { type } = require('../../models/index.datamapper');

module.exports = {

  async getAllTypes(_, res) {
    const types = await type.findAll();
    res.json(types);
  },
  async getNoDamageFrom(req, res) {
    const { id } = req.params;
    // const typeName = await type.findByPk(id);
    const imune = await type.findNoDamageFrom(id);
    return res.json(imune);
  },
  async getHalfDamageFrom(req, res) {
    const { id } = req.params;
    const resist = await type.findHalfDamageFrom(id);
    return res.json(resist);
  },
  async getNoDamageFromAndHalfDamageFrom(req, res) {
    const { id } = req.params;
    const result = await type.findNoDamageFromAndHalfDamageFrom(id);
    return res.json(result);
  },
  async getDoubleDamageFrom(req, res) {
    const { id } = req.params;
    const typeName = await type.findByPk(id);
    const weak = await type.findDoubleDamageFrom(typeName.id);
    return res.json(weak);
  },
  async getResistanceToTypeList(req, res) {
    const types = req.body;
    const index = [];
    for (let i = 1; i <= types.length; i += 1) {
      index.push(i);
    }

    const result = await type.findResistanceToTypeList(types, index);
    return res.json(result);
  },
};
