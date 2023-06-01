const { type, poke } = require('../../models');
const cacheServer = require('../cache');
const { ApiError } = require('../../helpers/errorHandler');
const getPokemonFromCache = require('./getPokemonFromCahe');
const preformatPokemon = require('./preformatePokemon');

const cache = cacheServer.getInstance();

module.exports = {

  async findDamage(damage, id, res) {
    try {
      const types = await type[damage](id);
      if (!types) {
        throw new ApiError('No types found', { statusCode: 404 });
      }

      const promises = types.map(async (typ) => {
        const pokemons = await poke.findAllByTypeId(typ.id);
        const preformattedPokemons = await Promise.all(
          pokemons.map(async (pokemon) => {
            const cachedPokemon = getPokemonFromCache(pokemon.id);
            if (cachedPokemon) {
              return cachedPokemon;
            }

            const preformattedPokemon = await preformatPokemon(pokemon);
            cache.set(pokemon.id, preformattedPokemon, cache.TTL);
            return preformattedPokemon;
          }),
        );
        return preformattedPokemons;
      });

      const allPokemons = await Promise.all(promises);
      if (!allPokemons) {
        throw new ApiError('No formatted pokemon', { statusCode: 500 });
      }

      return res.json(allPokemons.flat());
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

};
