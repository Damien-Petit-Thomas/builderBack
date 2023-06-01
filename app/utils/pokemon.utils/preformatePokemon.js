//* this utils function is to retrieve the pokemon data from the db and and pass it to the
//* buildFormatedPokemonFromDb function then add the pokemon to the cache

const { type } = require('../../models');
const buildPokemonObjectFromPokeDb = require('./buildFormatedPokemonFromDb');
const CachePokemon = require('../cache/pokemon.cache');
const CacheType = require('../cache/type.cache');

const cacheType = CacheType.getInstance();
const cache = CachePokemon.getInstance();

module.exports = async (pokemon) => {
  const { type1, type2 } = pokemon;
  const pokemonTypes = [type1, type2].filter(Boolean);
  const buildPokemons = await Promise.all(
    pokemonTypes.map(async (typeId) => {
      const cachedType = cacheType.get(typeId);
      if (cachedType) {
        console.log('cachedType', cachedType);
        return buildPokemonObjectFromPokeDb(pokemon, cachedType);
      }
      const typesData = await Promise.all(pokemonTypes.map((id) => type.findByPk(id)));
      cacheType.set(typeId, typesData, cacheType.TTL);
      const formatedPokemon = buildPokemonObjectFromPokeDb(pokemon, typesData);

      return formatedPokemon;
    }),
  );
  return buildPokemons;
};
