//* this controller is used to find the pokemon by the damage he can receive from a type

const { ApiError } = require('../../../helpers/errorHandler');

const { findDamage } = require('../../../utils/pokemon.utils/findDamage');

module.exports = {

  async getNoDamageFrom(req, res) {
    try {
      const { id } = req.params;
      return findDamage('findNoDamageFrom', id, res);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getHalfDamageFrom(req, res) {
    try {
      const { id } = req.params;

      return findDamage('findHalfDamageFrom', id, res);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getNoDamageFromOrHalfDamageFrom(req, res) {
    try {
      const { id } = req.params;
      return findDamage('findNoDamageFromAndHalfDamageFrom', id, res);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

};
