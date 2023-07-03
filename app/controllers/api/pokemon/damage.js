//* this controller is used to find the pokemon by the damage he can receive from a type

const { findDamage } = require('../../../utils/pokemon.utils/findDamage');

module.exports = {

  async getNoDamageFrom(req, res) {
    const { id } = req.params;
    const result = await findDamage('findNoDamageFrom', id);
    return res.status(200).json(result);
  },

  async getHalfDamageFrom(req, res) {
    const { id } = req.params;
    const result = await findDamage('findHalfDamageFrom', id);
    return res.status(200).json(result);
  },

  async getNoDamageFromOrHalfDamageFrom(req, res) {
    const { id } = req.params;
    const result = findDamage('findNoDamageFromAndHalfDamageFrom', id);
    return res.status(200).json(result);
  },

};
