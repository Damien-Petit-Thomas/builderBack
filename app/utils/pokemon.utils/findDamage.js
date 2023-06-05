const { type, poke } = require('../../models');

const { ApiError } = require('../../helpers/errorHandler');
const inCache = require('../cache/inCache');
const preformatPokemon = require('./preformatePokemon');
const pokeCache = require('../cache/pokemon.cache').getInstance();

module.exports = {

  async findDamage(damageLevel, id, res) {
    try {
      const types = await type[damageLevel](id);
      if (!types) {
        throw new ApiError('No types found', { statusCode: 404 });
      }

      const promises = types.map(async (typ) => {
        const pokemons = await poke.findAllByTypeId(typ.id);
        const preformattedPokemons = await Promise.all(
          pokemons.map(async (pokemon) => {
            const cache = inCache(pokemon.id, pokeCache);
            if (cache) return cache;

            const preformattedPokemon = await preformatPokemon(pokemon);

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
