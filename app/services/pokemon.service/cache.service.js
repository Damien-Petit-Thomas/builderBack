/* eslint-disable max-len */
//* this service is used to cache data from the database  *//
const CacheServer = require('../../utils/cache');

const cache = CacheServer.getInstance();
const { poke } = require('../../models/index.datamapper');
const logger = require('../../helpers/logger');
const preformatPokemon = require('../../utils/pokemon.utils/preformatePokemon');
const { ApiError } = require('../../helpers/errorHandler');

module.exports = {

  async cacheAllPokemon() {
    const count = await poke.count();
    const promises = [];
    try {
      for (let i = 1; i <= count; i += 1) {
        promises.push(poke.findByPk(i));
      }
      const pokemons = await Promise.all(promises);
      if (pokemons.length !== count) throw new ApiError('pokemon count is not correct', { statusCode: 500 });

      const formatedPokemons = await Promise.all(pokemons.map((pokemon) => preformatPokemon(pokemon)));
      formatedPokemons.forEach((pokemon) => {
        // this way each pokemon is fotmated and cached
        cache.set(pokemon.id, pokemon, cache.TTL);
        logger.info(`pokemon ${pokemon.name} cached`);
      });
      if (!formatedPokemons) throw new ApiError('no formated pokemon', { statusCode: 500 });
      return formatedPokemons;
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },
};
