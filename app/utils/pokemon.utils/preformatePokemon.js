//* this utils function is to retrieve the pokemon data from the db and and pass it to the
//* buildFormatedPokemonFromDb function then add the pokemon to the cache
const logger = require('../../helpers/logger');
const { type } = require('../../models/index.datamapper');
const buildPokemonObjectFromPokeDb = require('./buildFormatedPokemonFromDb');
const CacheServer = require('../cache');

const cache = CacheServer.getInstance();

module.exports = async (pokemon) => {
  const { type1, type2 } = pokemon;
  const pokemonTypes = [type1, type2].filter(Boolean);

  const typesData = await Promise.all(pokemonTypes.map((typeId) => type.findByPk(typeId)));

  const formatedPokemon = buildPokemonObjectFromPokeDb(pokemon, typesData);

  cache.set(pokemon.id, formatedPokemon, cache.TTL);
  logger.log(`pokemon ${pokemon.id} added to cache`);

  return formatedPokemon;
};
