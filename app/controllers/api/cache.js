const ApiError = require('../../errors/apiError');
const { cacheAllPokemon } = require('../../services/pokemon.service/cache.service');

module.exports = {

  async getAll(_, res) {
    try {
      const response = await cacheAllPokemon();
      return res.json(response);
    } catch (error) {
      throw new ApiError(error.message, { statuscode: 500 });
    }
  },
};
