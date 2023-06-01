//* this utils function is to retrieve the pokemon data from the db and and pass it to the
//* buildFormatedPokemonFromDb function then add the pokemon to the cache

const { type } = require('../../models');
const buildPokemonObjectFromPokeDb = require('./buildFormatedPokemonFromDb');

const CacheType = require('../cache/type.cache');

const cacheType = CacheType.getInstance();

module.exports = async (pokemon) => {
  const { type1, type2 } = pokemon;
  const pokemonTypes = [type1, type2].filter(Boolean);

  const typesData = await Promise.all(pokemonTypes.map(async (typeId) => {
    const cachedType = cacheType.get(typeId);
    if (cachedType) {
      return cachedType;
    }

    const typeData = await type.findByPk(typeId);
    cacheType.set(typeId, typeData, cacheType.TTL);
    return typeData;
  }));

  return buildPokemonObjectFromPokeDb(pokemon, typesData);
};
