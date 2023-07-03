const { ApiError } = require('../../helpers/errorHandler');
const preformatPokemon = require('./preformatePokemon');

module.exports = {

  async getPokemonBy(table, id, res) {
    const pokemons = await table.findAllBy(...id);
    if (!pokemons) throw new ApiError('No data found', { statusCode: 404 });
    const promises = pokemons.map(async (pokemon) => preformatPokemon(pokemon));
    const allPokemons = await Promise.all(promises);
    if (!allPokemons) throw new ApiError('no formated pokemon', { statusCode: 500 });
    return res.status(200).json(allPokemons);
  },

};
