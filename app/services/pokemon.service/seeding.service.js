/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */

//* this service is used to seed the database with formatted data from the pokeApi  *//

const { poke, type } = require('../../models/index.datamapper');
const { pokeApi } = require('./index');
const buildPokemonObjectFromPokeApi = require('../../utils/pokemon.utils/buildPokemonFromPokeApi');
const { getDamage } = require('../../utils/pokemon.utils/getDamage');
const logger = require('../../helpers/logger');
const { ApiError } = require('../../helpers/errorHandler');

module.exports = {

  async seedAllPokemon() {
    for (let i = 1; i <= 1010; i += 1) {
      try {
        const isPokemonInDb = await poke.findByPk(i);
        if (!isPokemonInDb) {
          // we create a formatted pokemon object from the pokeApi before inserting it in the db
          const { formatedPokemon } = await buildPokemonObjectFromPokeApi(i);

          const pokeSavedInDb = await poke.insertPokemon(formatedPokemon);
          logger.log(`pokemon ${pokeSavedInDb.name} saved in db`);
        } else {
          logger.log(`pokemon ${isPokemonInDb.name} already in db`);
        }
      } catch (err) {
        throw new ApiError(err.message, err.infos);
      }
    }
  },

  async seedAllType() {
    const { damages, frenchType, englishName } = await pokeApi.getAllTypesData();

    // we create formatted type objects from the pokeApi before inserting them in the db
    // we have to calculate the damageFrom array for each type
    // in this purpose we initialize an empty object that will contain the damageFrom array for each type
    const damageType = {};
    const promises = frenchType.map(async (typeData, index) => {
      try { // we check if the type is already in the db
        const isTypeInDb = await type.findOneByName(typeData.name);
        if (isTypeInDb) {
          logger.log(`type ${frenchType.name} already in db`);
        } // if not we associate the damageFrom array to the type name
        damageType[typeData.name] = damages[index];
      } catch (err) {
        throw new ApiError('une erreur est survenue lors de la récupération des types', { statusCode: 500 });
      }
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
