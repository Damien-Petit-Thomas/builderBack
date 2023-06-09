const inCache = require('../cache/inCache');
const { ApiError } = require('../../helpers/errorHandler');
const { poke } = require('../../models');
const formatPoke = require('./dataMapToFormat');

module.exports = {
  async cacheOrFormatPokemon(id, cacheInstance) {
    const cache = inCache(id, cacheInstance);
    if (cache) return cache;

    try {
      const pokemon = await poke.findByPk(id);
      if (!pokemon) {
        throw new ApiError(`Pokemon with id ${id} not found`, { statusCode: 500 });
      }
      const response = await formatPoke([pokemon]);
      return response[0];
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },
};
