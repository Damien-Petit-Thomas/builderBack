/* eslint-disable max-len */

const { pokeApi } = require('../../services/pokemon.service/index');
const getFrenchTypesAndDamageFromOnePoke = require('./getFrenchTypesAndDamageFromOnePoke');
const { getFormatedStat } = require('./getFormatedPokemonStat');
const { getDamage } = require('./getDamage');

module.exports = async function buildPokemonFromPokeApi(id) {
  //* method to get all what we need to build a pokemon object from pokeApi
  //* and put it in cache

  const pokemonData = await pokeApi.getPokemonData(id);
  const stats = getFormatedStat(pokemonData.stats);

  const sprite = pokemonData.sprites.other['official-artwork'].front_default;
  const { damage, frenchTypes, ids } = await getFrenchTypesAndDamageFromOnePoke(pokemonData.types.map((typ) => typ.type.name));

  const noDamage = damage[0].no_damage_from.map((typ) => typ.name);
  const halfDamage = damage[0].half_damage_from.map((typ) => typ.name);
  const doubleDamage = damage[0].double_damage_from.map((typ) => typ.name);
  // on stocke les types occasionnant des dégats nuls, double et moitié pour le second type du pokemon si il en a un
  const noDamage2 = damage[1] ? damage[1].no_damage_from.map((typ) => typ.name) : [];
  const halfDamage2 = damage[1] ? damage[1].half_damage_from.map((typ) => typ.name) : [];
  const doubleDamage2 = damage[1] ? damage[1].double_damage_from.map((typ) => typ.name) : [];
  // on construit 3 tableaux contenant les types occasionnant des dégats nuls, double et moitié pour chaque type du pokemon
  const noDamageFrom = noDamage.concat(noDamage2);
  const halfDamageFrom = halfDamage.concat(halfDamage2);
  const doubleDamageFrom = doubleDamage.concat(doubleDamage2);
  // const noDamageFrom = damage[1] ? damage[0].no_damage_from.map((type) => type.name).concat(damage[1].no_damage_from.map((type) => type.name)) : damage[0].no_damage_from.map((type) => type.name);
  // const halfDamageFrom = damage[1] ? damage[0].half_damage_from.map((type) => type.name).concat(damage[1].half_damage_from.map((type) => type.name)) : damage[0].half_damage_from.map((type) => type.name);
  // const doubleDamageFrom = damage[1] ? damage[0].double_damage_from.map((type) => type.name).concat(damage[1].double_damage_from.map((type) => type.name)) : damage[0].double_damage_from.map((type) => type.name);
  // on calcule les dégats totaux occasionnés par les types adverses
  const totalDamageFrom = getDamage(noDamageFrom, halfDamageFrom, doubleDamageFrom);
  // on récupère le nom français du pokemon
  const { frenchName, gen } = await pokeApi.getFrenchName(id);

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
