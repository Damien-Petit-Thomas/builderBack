const logger = require('../../helpers/logger');
const { type } = require('../../models/index.datamapper');
const buildPokemonObjectFromPokeDb = require('./buildFormatedPokemonFromDb');
const CacheServer = require('../cache');

const cache = CacheServer.getInstance();

module.exports = async (pokemon) => {
  const pokemonType = [];
  pokemonType.push(pokemon.type1);
  if (pokemon.type2) {
    pokemonType.push(pokemon.type2);
  }

  // on recupere les données de degats pour chaque type
  const promises = pokemonType.map(async (typeId) => {
    const typeData = await type.findByPk(typeId);
    return typeData;
  });
  const typesData = await Promise.all(promises);
  const formatedPokemon = buildPokemonObjectFromPokeDb(pokemon, typesData);
  // on stocke le pokemon en cache
  cache.set(pokemon.id, formatedPokemon, this.TTL);
  logger.log(`pokemon ${pokemon.id} added to cache`);
  return (formatedPokemon);
};
