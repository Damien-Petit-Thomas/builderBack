const preformatePokemon = require('./preformatePokemon');
const { ApiError } = require('../../helpers/errorHandler');
const inCache = require('../cache/inCache');
const pokeCache = require('../cache/pokemon.cache').getInstance();

module.exports = async (data) => {
  try {
    const promises = data.map(async (pokemon) => {
      const cache = inCache(pokemon.id, pokeCache);
      if (cache) return cache;

      return preformatePokemon(pokemon);
    });
    const allPokemons = await Promise.all(promises);
    if (!allPokemons) {
      throw new ApiError('no formated pokemon', { statusCode: 500 });
    }
    return allPokemons;
  } catch (err) {
    throw new ApiError(err.message, err.infos);
  }
};
