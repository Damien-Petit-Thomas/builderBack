/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */

//* this service is used to seed the database with formatted data from the pokeApi  *//

const { poke, type, aby } = require('../../models');
const { pokeApi } = require('./index');
const buildPokemonObjectFromPokeApi = require('../../utils/pokemon.utils/buildPokemonFromPokeApi');
const { getModifyingAbility } = require('../../utils/pokemon.utils/getModifyingAbility');
const { getDamage } = require('../../utils/pokemon.utils/getDamage');
const logger = require('../../helpers/logger');

module.exports = {

  async seedAllPokemon() {
    for (let i = 1; i <= 9999; i += 1) {
      const isPokemonInDb = await poke.findByPk(i);
      if (!isPokemonInDb) {
        // we create a formatted pokemon object from the pokeApi before inserting it in the db
        const { formatedPokemon } = await buildPokemonObjectFromPokeApi(i);

        const pokeSavedInDb = await poke.insertPokemon(formatedPokemon);
        logger.log(`pokemon ${pokeSavedInDb.name} saved in db`);
      } else {
        logger.log(`pokemon ${isPokemonInDb.name} already in db`);
      }
    }
  },

  async seedAllType() {
    const numberOfTypes = 18; // there are 18 types in the pokeApi we don't want to seed the unknown and shadow types
    let isTypeInDb = await type.findAll();
    if (isTypeInDb.length === numberOfTypes) {
      isTypeInDb = 'all types already in db';
      return isTypeInDb;
    }
    const { damages, frenchType, englishName } = await pokeApi.getAllTypesData();

    // we create formatted type objects from the pokeApi before inserting them in the db
    // we have to calculate the damageFrom array for each type
    // in this purpose we initialize an empty object that will contain the damageFrom array for each type
    const damageType = {};
    const promises = frenchType.map(async (typeData, index) => {
      // we check if the type is already in the db
      const isTypeInDbByName = await type.findOneByName(typeData.name);
      if (isTypeInDbByName) {
        logger.log(`type ${frenchType.name} already in db`);
      } // if not we associate the damageFrom array to the type name
      damageType[typeData.name] = damages[index];
    });

    await Promise.all(promises);

    const formattedTypes = frenchType.map((typeData, index) => {
      // We retrieve arrays of type IDs from the URL and split them based on their damage relation
      const noDamageFrom = damageType[typeData.name].no_damage_from.map((typ) => typ.url.split('/')[6]);
      const halfDamageFrom = damageType[typeData.name].half_damage_from.map((typ) => typ.url.split('/')[6]);
      const doubleDamageFrom = damageType[typeData.name].double_damage_from.map((typ) => typ.url.split('/')[6]);
      const id = index + 1;
      // we return an object with the preformatted data for each type
      return {
        id,
        name: englishName[index],
        frenchName: typeData.name,
        damageFrom: getDamage(noDamageFrom, halfDamageFrom, doubleDamageFrom),
      };
    });

    await Promise.all(formattedTypes.map((typObject) => type.insertType(typObject)));

    return formattedTypes;
  },

  async seedAllAbilities() {
    const data = await pokeApi.getAllAbilitiesData();
    const promises = data.map(async (item) => {
      let damageFrom = [];
      const modifyingAbility = [157, 114, 78, 31, 18, 297, 273, 47, 199];
      if (modifyingAbility.includes(Number(item.id))) {
        damageFrom = await getModifyingAbility(Number(item.id));
      }

      const abiInDb = {
        id: item.id,
        name: item.name,
        frenchname: item.frenchName,
        description: item.description,
        damagefrom: damageFrom,
      };

      return aby.insertAbility(abiInDb);
    });

    await Promise.all(promises);

    return data;
  },

  async seedOneAbilityById(abilityId) {
    const data = await pokeApi.getAbilityData(abilityId);
    let damageFrom;
    const modifyingAbility = [157, 114, 78, 31, 18, 297, 273, 47, 199, 11, 10, 25, 26];
    if (modifyingAbility.includes(Number(data.id))) {
      damageFrom = await getModifyingAbility(Number(data.id));
    }

    const abiInDb = {
      id: data.id,
      name: data.name,
      frenchname: data.frenchName,
      description: data.description,
      damagefrom: damageFrom,
    };

    aby.insertAbility(abiInDb);
    return abiInDb;
  },

  async seedPokemonAbility() {
    const data = await pokeApi.getAllAbilitiesData();
    const promises = data.map(async (item) => {
      const records = await item.pokemons.map((index) => ({
        poke_id: index,
        abi_id: item.id,
      }));
      return records;
    });
    const allRecords = (await Promise.all(promises)).flat();

    return allRecords;
  },

  async seedOneTypeById(typeId) {
    const data = await pokeApi.getTypeData(typeId);
    const { damages, frenchType, englishName } = data;
    const damageType = {};
    damageType[frenchType.name] = damages;
    const noDamageFrom = damageType[frenchType.name].no_damage_from.map((typ) => typ.url.split('/')[6]);
    const halfDamageFrom = damageType[frenchType.name].half_damage_from.map((typ) => typ.url.split('/')[6]);
    const doubleDamageFrom = damageType[frenchType.name].double_damage_from.map((typ) => typ.url.split('/')[6]);
    const typ = {
      id: typeId,
      name: englishName,
      frenchName: frenchType.name,
      damageFrom: getDamage(noDamageFrom, halfDamageFrom, doubleDamageFrom),
    };

    type.insertType(typ);
  },

};
