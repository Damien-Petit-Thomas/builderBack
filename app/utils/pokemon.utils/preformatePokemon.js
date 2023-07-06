//* this utils function is to retrieve the pokemon data from the db and and pass it to the
//* buildFormatedPokemonFromDb function then add the pokemon to the cache

const { type } = require('../../models');
const buildPokemonObjectFromPokeDb = require('./buildFormatedPokemonFromDb');
const { ApiError } = require('../../helpers/errorHandler');
const typeCache = require('../cache/type.cache').getInstance();
const inCache = require('../cache/inCache');

module.exports = async (pokemon) => {
  const { type1, type2 } = pokemon;
  const pokemonTypes = [type1, type2].filter(Boolean);
  try {
    const typesData = await Promise.all(pokemonTypes.map(async (id) => {
      const cache = inCache(id, typeCache);
      if (cache) return cache;
      console.log('not in cache');
      const typeData = await type.findByPk(id);
      typeCache.set(id, typeData, typeCache.TTL);
      return typeData;
    }));

    return buildPokemonObjectFromPokeDb(pokemon, typesData);
  } catch (err) {
    throw new ApiError(err.message, err.infos);
  }
};
