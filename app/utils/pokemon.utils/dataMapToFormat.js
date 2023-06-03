const preformatePokemon = require('./preformatePokemon');
const { ApiError } = require('../../helpers/errorHandler');
const inCache = require('../cache/inCache');
const pokeCache = require('../cache/pokemon.cache').getInstance();

module.exports = async (data, res) => {
  try {
    const promises = data.map(async (pokemon) => {
      if (inCache(pokemon.id, pokeCache)) return inCache(pokemon.id, pokeCache);
      return preformatePokemon(pokemon);
    });
    const allPokemons = await Promise.all(promises);
    if (!allPokemons) {
      throw new ApiError('no formated pokemon', { statusCode: 500 });
    }
    return res.status(200).json(allPokemons);
  } catch (err) {
    throw new ApiError(err.message, err.infos);
  }
};
