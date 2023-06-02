const preformatePokemon = require('./preformatePokemon');
const { ApiError } = require('../../helpers/errorHandler');
const inCache = require('./getPokemonFromCahe');

module.exports = async (data, res) => {
  try {
    const promises = data.map(async (pokemon) => {
      if (inCache(pokemon.id)) return inCache(pokemon.id);
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
