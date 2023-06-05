//* this utils function is to retrieve the pokemon data from the db and and pass it to the
//* buildFormatedPokemonFromDb function then add the pokemon to the cache

const { type } = require('../../models');
const buildPokemonObjectFromPokeDb = require('./buildFormatedPokemonFromDb');
const { ApiError } = require('../../helpers/errorHandler');
const cacheType = require('../cache/type.cache').getInstance();
const inCache = require('../cache/inCache');

module.exports = async (pokemon) => {
  const { type1, type2 } = pokemon;
  const pokemonTypes = [type1, type2].filter(Boolean);
  try {
    const typesData = await Promise.all(pokemonTypes.map(async (id) => {
      const cache = inCache(id, cacheType);
      if (cache) return cache;
      const typeData = await type.findByPk(id);
      cacheType.set(id, typeData, cacheType.TTL);
      return typeData;
    }));

    return buildPokemonObjectFromPokeDb(pokemon, typesData);
  } catch (err) {
    throw new ApiError(err.message, err.infos);
  }
};
