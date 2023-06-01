//* this utils function is to retrieve the pokemon data from the db and and pass it to the
//* buildFormatedPokemonFromDb function then add the pokemon to the cache

const { type } = require('../../models');
const buildPokemonObjectFromPokeDb = require('./buildFormatedPokemonFromDb');

const CacheType = require('../cache/type.cache');

const cacheType = CacheType.getInstance();

module.exports = async (pokemon) => {
  const { type1, type2 } = pokemon;
  const typesData = [];
  const pokemonTypes = [type1, type2].filter(Boolean);

  await Promise.all(pokemonTypes.map(async (typeId) => {
    const cachedType = cacheType.get(typeId);
    if (cachedType) {
      console.log('cached type');
      typesData.push(cachedType);
    } else {
      const typeData = await type.findByPk(typeId);
      typesData.push(typeData);
      cacheType.set(typeId, typeData, cacheType.TTL);
    }
  }));

  return buildPokemonObjectFromPokeDb(pokemon, typesData);
};
