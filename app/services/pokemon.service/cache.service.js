/* eslint-disable max-len */
//* this service is used to cache data from the database  *//
const cache = require('../../utils/cache/pokemon.cache').getInstance();
const typeCache = require('../../utils/cache/type.cache').getInstance();
const { poke, type } = require('../../models');
const logger = require('../../helpers/logger');
const preformatPokemon = require('../../utils/pokemon.utils/preformatePokemon');
const { ApiError } = require('../../helpers/errorHandler');

module.exports = {

  // async cacheAllPokemon() {
  //   const count = await poke.count();
  //   const promises = [];
  //   try {
  //     for (let i = 1; i <= count; i += 1) {
  //       promises.push(poke.findByPk(i));
  //     }
  //     const pokemons = await Promise.all(promises);
  //     if (pokemons.length !== count) throw new ApiError('pokemon count is not correct', { statusCode: 500 });

  //     const formatedPokemons = await Promise.all(pokemons.map((pokemon) => preformatPokemon(pokemon)));
  //     formatedPokemons.forEach((pokemon) => {
  //       // this way each pokemon is fotmated and cached
  //       cache.set(pokemon.id, pokemon, cache.TTL);
  //     });
  //     if (!formatedPokemons) throw new ApiError('no formated pokemon', { statusCode: 500 });
  //     return formatedPokemons;
  //   } catch (err) {
  //     throw new ApiError(err.message, err.infos);
  //   }
  // },

  async cacheAllPokemon() {
    const pokemons = await poke.findAll();
    const formatedPokemons = await Promise.all(pokemons.map((pokemon) => preformatPokemon(pokemon)));
    formatedPokemons.forEach((pokemon) => {
    // this way each pokemon is fotmated and cached
      cache.set(pokemon.id, pokemon, cache.TTL);
    });
    if (!formatedPokemons) throw new ApiError('no formated pokemon', { statusCode: 500 });
    return formatedPokemons;
  },

  async cacheAllType() {
    const typeData = await type.findAll();
    typeData.forEach((typ) => typeCache.set(typ.id, typ, typeCache.TTL));
    return true;
  },
};
