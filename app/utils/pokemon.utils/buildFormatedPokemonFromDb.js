//* this function is used to build a pokemon object from the data fetched from the database
// it give the pokemon object structure that will be used in the front end
const { getDamage } = require('./getDamageFromDb');
const CachePokemon = require('../cache/pokemon.cache');

const cache = CachePokemon.getInstance();
module.exports = function buildPokemonObjectFromPokeDb(pokemonData, typesData) {
  const damage = typesData.map((type) => type.damagefrom);
  const pokemon = {
    id: pokemonData.id,
    name: pokemonData.name,
    gen: pokemonData.gen_id,
    typeName: typesData.map((type) => type.frenchname),
    type: typesData.map((type) => type.id),
    sprite: pokemonData.sprite,
    hp: pokemonData.hp,
    attack: pokemonData.attack,
    defense: pokemonData.defense,
    specialAttack: pokemonData.sp_att,
    specialDefense: pokemonData.sp_def,
    speed: pokemonData.speed,
    damageFromRelations: getDamage(damage),

  };
  cache.set(pokemon.id, pokemon, cache.TTL);
  return pokemon;
};
