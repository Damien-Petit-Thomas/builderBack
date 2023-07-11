/* eslint-disable max-len */
//* this service is formate a pokemon directly from the pokeApi  *//
// in practice the db is filled with the data from the pokeApi and then the formated pokemon is created from the db
const { pokeApi } = require('../../services/pokemon.service/index');
const getFrenchTypesAndDamageFromOnePoke = require('./getFrenchTypesAndDamageFromOnePoke');
const { getFormatedStat } = require('./getFormatedPokemonStat');
const { getDamage } = require('./getDamage');
const { ApiError } = require('../../helpers/errorHandler');

module.exports = async function buildPokemonFromPokeApi(id) {
  //* method to get all what we need to build a pokemon object from pokeApi
  //* and put it in cache

  const pokemonData = await pokeApi.getPokemonData(id);

  if (!pokemonData) throw new ApiError('No pokemon found to seed', { statusCode: 404 });
  const stats = getFormatedStat(pokemonData.stats);

  const sprite = pokemonData.sprites.other['official-artwork'].front_default;
  const { damage, frenchTypes, ids } = await getFrenchTypesAndDamageFromOnePoke(pokemonData.types.map((typ) => typ.type.name));
  // we retrieve for each type the damage the type id using thr url and put it in an array depending on the damage
  const noDamage = damage[0].no_damage_from.map((typ) => typ.url.split('/')[6]);
  const halfDamage = damage[0].half_damage_from.map((typ) => typ.url.split('/')[6]);
  const doubleDamage = damage[0].double_damage_from.map((typ) => typ.url.split('/')[6]);
  // a pokemon can have 1 or 2 types
  const noDamage2 = damage[1] ? damage[1].no_damage_from.map((typ) => typ.url.split('/')[6]) : [];
  const halfDamage2 = damage[1] ? damage[1].half_damage_from.map((typ) => typ.url.split('/')[6]) : [];
  const doubleDamage2 = damage[1] ? damage[1].double_damage_from.map((typ) => typ.url.split('/')[6]) : [];
  // we concat the 2 arrays of damage from the 2 types
  const noDamageFrom = noDamage.concat(noDamage2);
  const halfDamageFrom = halfDamage.concat(halfDamage2);
  const doubleDamageFrom = doubleDamage.concat(doubleDamage2);
  // const noDamageFrom = damage[1] ? damage[0].no_damage_from.map((type) => type.name).concat(damage[1].no_damage_from.map((type) => type.name)) : damage[0].no_damage_from.map((type) => type.name);
  // const halfDamageFrom = damage[1] ? damage[0].half_damage_from.map((type) => type.name).concat(damage[1].half_damage_from.map((type) => type.name)) : damage[0].half_damage_from.map((type) => type.name);
  // const doubleDamageFrom = damage[1] ? damage[0].double_damage_from.map((type) => type.name).concat(damage[1].double_damage_from.map((type) => type.name)) : damage[0].double_damage_from.map((type) => type.name);
  // on calcule les dégats totaux occasionnés par les types adverses

  const totalDamageFrom = await getDamage(noDamageFrom, halfDamageFrom, doubleDamageFrom);
  // we retrieve the french name and the gen of the pokemon
  const { frenchName, gen } = await pokeApi.getFrenchNameAndGen(id);
  // we build 2 objects, one for the front end and one for the db se
  const pokemon = {
    id,
    name: frenchName,
    gen,
    typeName: frenchTypes,
    type: ids,
    sprite,
    hp: stats.hp,
    attack: stats.attack,
    defense: stats.defense,
    specialAttack: stats.specialAttack,
    specialDefense: stats.specialDefense,
    speed: stats.speed,
    damageFromRelations: totalDamageFrom,
  };

  const formatedPokemon = {
    id,
    name: frenchName,
    sprite,
    gen_id: gen,
    type1: ids[0],
    type2: ids[1] || null,
    hp: stats.hp,
    attack: stats.attack,
    defense: stats.defense,
    specialAttack: stats.specialAttack,
    specialDefense: stats.specialDefense,
    speed: stats.speed,
  };

  return { pokemon, formatedPokemon };
};
