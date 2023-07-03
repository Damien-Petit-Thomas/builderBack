const { ApiError } = require('../../helpers/errorHandler');
const { cacheAllPokemon } = require('../../services/pokemon.service/cache.service');

module.exports = {

  async getAll(_, res) {
    const response = await cacheAllPokemon();
    if (!response) throw new ApiError('No pokemon found', { statusCode: 404 });
    return res.json(response);
  },
};
