/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-nested-ternary */
// const axios = require('axios');
// const { poke } = require('../models/index.datamapper');
// const { getFormatedStat } = require('../utils/pokemon.utils/getFormatedPokemonStat');
// const { getDamage } = require('../utils/pokemon.utils/getDamage');
// const { type } = require('../models/index.datamapper');
// const CacheServer = require('../utils/cache');
// const logger = require('../helpers/logger');
// const { pokeServ } = require('./pokemon.service/index');

// const cache = CacheServer.getInstance();

// const TTL = 60 * 3; // 3 minutes
// const BASE_URL = 'https://pokeapi.co/api/v2/';

//* fonction pour récupérer le nombre de generations  *//

// async function getAllGenerations() {
//   const response = await axios.get(`${BASE_URL}generation`);
//   const numberOfGenerations = response.data.count;
//   return numberOfGenerations;
// }

//* fonction pour recuperer tout les pokemon d'une generation $//

// async function getAllPokeByGeneration(id) {
//   const response = await axios.get(`${BASE_URL}generation/${id}`);

//   return response.data.pokemon_species;
// }

//* fonction pour récupérer les stats d'un pokemon  *//
// c'est la meme chose que getPokemonData mais on ne récupère que les stats
// async function getStat(id) {
//   const response = await axios.get(
//     `${BASE_URL}pokemon/${id}`,
//   );
//   const { stats } = response.data;
// return getFormatedStat(stats);
// }

//* fonction pour récupérer le nom français d'un pokemon  *//

// async function getFrenchName(id) {
//   const response = await axios.get(`${BASE_URL}pokemon-species/${id}`);
//   const pokeName = response.data.names.find((name) => name.language.name === 'fr').name;
//   return pokeName;
// }

//* fonction pour récupérer les données d'un pokemon  *//
// contient le nom des types et id des pokemons et sprites

// async function getPokemonData(id) {
//   const response = await axios.get(`${BASE_URL}pokemon/${id}`);
//   return response.data;
// }

//* fonction pour récupérer toutes les données d'un type  *//

// async function getTypeData(typeName) {
//   const response = await axios.get(`${BASE_URL}type/${typeName}`);
//   return response.data;
// }

//* fonction pour récupérer  les données de dégats //
//* d'un type et le nom en français des types *//
// en effet les noms en français sont recuperés sur le même endpoint que les dégats
// async function getFrenchDataAndDamage(array) {
//   const damage = [];
//   const frenchType = [];
//   const ids = [];
//   for (let i = 0; i < array.length; i += 1) {
//     const typeData = await getTypeData(array[i]);
//     damage.push(typeData.damage_relations);
//     frenchType.push(typeData.names.find((name) => name.language.name === 'fr').name);
//     ids.push(typeData.id);
//   }
//   return { damage, frenchType, ids };
// }

//* fonction pour construire l'objet pokemon  *//

// async function buildPokemonObjectFromPokeApi(id) {
//   // on recupère les premières données du pokemon
//   const pokemonData = await getPokemonData(id);
//   // on recupère les stats du pokemon
//   const stats = await getStat(id);
//   const sprite = pokemonData.sprites.other['official-artwork'].front_default;
//   // on recupère les données de dégats du pokemon et le nom en français
//   const { damage, frenchType, ids } = await getFrenchDataAndDamage(pokemonData.types.map((typ) => typ.type.name));
//   logger.log(ids);
//   // on stocke les types occasionnant des dégats nuls, double et moitié pour le premier type du pokemon
//   const noDamage = damage[0].no_damage_from.map((typ) => typ.name);
//   const halfDamage = damage[0].half_damage_from.map((typ) => typ.name);
//   const doubleDamage = damage[0].double_damage_from.map((typ) => typ.name);
//   // on stocke les types occasionnant des dégats nuls, double et moitié pour le second type du pokemon si il en a un
//   const noDamage2 = damage[1] ? damage[1].no_damage_from.map((typ) => typ.name) : [];
//   const halfDamage2 = damage[1] ? damage[1].half_damage_from.map((typ) => typ.name) : [];
//   const doubleDamage2 = damage[1] ? damage[1].double_damage_from.map((typ) => typ.name) : [];
//   // on construit 3 tableaux contenant les types occasionnant des dégats nuls, double et moitié pour chaque type du pokemon
//   const noDamageFrom = noDamage.concat(noDamage2);
//   const halfDamageFrom = halfDamage.concat(halfDamage2);
//   const doubleDamageFrom = doubleDamage.concat(doubleDamage2);
//   // const noDamageFrom = damage[1] ? damage[0].no_damage_from.map((type) => type.name).concat(damage[1].no_damage_from.map((type) => type.name)) : damage[0].no_damage_from.map((type) => type.name);
//   // const halfDamageFrom = damage[1] ? damage[0].half_damage_from.map((type) => type.name).concat(damage[1].half_damage_from.map((type) => type.name)) : damage[0].half_damage_from.map((type) => type.name);
//   // const doubleDamageFrom = damage[1] ? damage[0].double_damage_from.map((type) => type.name).concat(damage[1].double_damage_from.map((type) => type.name)) : damage[0].double_damage_from.map((type) => type.name);

//   // on calcule les dégats totaux occasionnés par les types adverses
//   const totalDamageFrom = getDamage(noDamageFrom, halfDamageFrom, doubleDamageFrom);

//   // on récupère le nom français du pokemon
//   const frenchName = await getFrenchName(id);

//   // on construit l'objet pokemon
//   const pokemon = {
//     id,
//     name: frenchName,
//     sprite,
//     // species: pokemonData.species.name,
//     type: frenchType,
//     damageFromRelations: totalDamageFrom,
//     // noDamageFrom,
//     // halfDamageFrom,
//     // doubleDamageFrom,
//     hp: stats.hp,
//     attack: stats.attack,
//     defense: stats.defense,
//     specialAttack: stats.specialAttack,
//     specialDefense: stats.specialDefense,
//     speed: stats.speed,
//   };

//   const formatedPokemon = {
//     id,
//     name: frenchName,
//     sprite,
//     // species: pokemonData.species.name,
//     type1: ids[0],
//     type2: ids[1] || null,
//     hp: stats.hp,
//     attack: stats.attack,
//     defense: stats.defense,
//     specialAttack: stats.specialAttack,
//     specialDefense: stats.specialDefense,
//     speed: stats.speed,
//   };

//   const pokeSaved = poke.insertPokemon(formatedPokemon);
//   if (pokeSaved) {
//     logger.log(`pokemon saved ${id}`);
//   } else {
//     logger.log('pokemon not saved');
//   }

//   // on stocke l'objet pokemon en cache  avec comme clé l'id du pokemon
//   cache.set(id, pokemon, TTL);

//   return pokemon;
// }

// async function findById(id) {
//   return cache.get(id) || poke.
// }

// async function getAllTypes() {
//   const response = await axios.get('https://pokeapi.co/api/v2/type');
//   return response.data.results;
// }

// async function getAllTypesData() {
//   const types = await pokeApi.getAllTypes();
//   const damages = [];
//   const frenchType = [];
//   const englishName = [];
//   for (let i = 0; i < types.length - 2; i += 1) {
//     const typeData = await pokeApi.getTypeData(i);
//     damages.push(typeData.damage_relations);
//     frenchType.push(typeData.names.find((name) => name.language.name === 'fr'));
//     englishName.push(types[i].name);
//   }
//   return { damages, frenchType, englishName };
// }

// async function buildAllPokemonObjects() {
//   for (let i = 1; i <= 1010; i += 1) {
//     try {
//       const isPokemonInDb = await poke.findByPk(i);
//       if (!isPokemonInDb) {
//         await buildPokemonObjectFromPokeApi(i);
//       }
//       logger.log(`pokemon ${i} already in db`);
//     } catch (e) {
//       logger.log(e);
//     }
//   }
// }

// async function formatedDamageFromByType() {
//   const { damages, frenchType, englishName } = await getAllTypesData();

//   const damageType = {};

//   for (let i = 0; i < frenchType.length; i += 1) {
//     damageType[frenchType[i].name] = damages[i];
//   }

//   // on stock les types accasionnant des dégats normaux , double, et moitie

//   for (let i = 0; i < frenchType.length; i += 1) {
//     const noDamageFrom = damageType[frenchType[i].name].no_damage_from.map((typ) => typ.name);
//     const halfDamageFrom = damageType[frenchType[i].name].half_damage_from.map((typ) => typ.name);
//     const doubleDamageFrom = damageType[frenchType[i].name].double_damage_from.map((typ) => typ.name);
//     const id = i + 1;
//     const typ = {
//       id,
//       name: englishName[i],
//       frenchName: frenchType[i].name,
//       damageFrom: getDamage(noDamageFrom, halfDamageFrom, doubleDamageFrom),
//     };

//     type.insertType(typ);
//   }
// }

// module.exports = {
//   buildAllPokemonObjects,
//   buildPokemonObjectFromPokeApi,
//   findById,
//   formatedDamageFromByType,
//   getAllGenerations,
//   getPokemonData,
//   getAllPokeByGeneration,
// };
