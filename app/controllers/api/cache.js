const { ApiError } = require('../../helpers/errorHandler');
const { cacheAllPokemon, cacheAllType } = require('../../services/pokemon.service/cache.service');

module.exports = {

  async getAll(_, res) {
    const typeCach = await cacheAllType();
    if (!typeCach) throw new ApiError('No type found', { statusCode: 404 });
    const response = await cacheAllPokemon();
    if (!response) throw new ApiError('No pokemon found', { statusCode: 404 });
    return res.json(response);
  },
};
