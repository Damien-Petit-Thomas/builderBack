/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */
const { poke, type } = require('../../models/index.datamapper');
const { pokeApi } = require('./index');
const buildPokemonObjectFromPokeApi = require('../../utils/pokemon.utils/buildPokemonFromPokeApi');
const { getDamage } = require('../../utils/pokemon.utils/getDamage');
const logger = require('../../helpers/logger');

module.exports = {

  async seedAllPokemon() {
    for (let i = 1; i <= 1010; i += 1) {
      try {
        const isPokemonInDb = await poke.findByPk(i);
        if (!isPokemonInDb) {
          const { formatedPokemon } = await buildPokemonObjectFromPokeApi(i);

          const pokeSavedInDb = await poke.insertPokemon(formatedPokemon);
          logger.log(`pokemon ${pokeSavedInDb.name} saved in db`);
        } else {
          logger.log(`pokemon ${isPokemonInDb.name} already in db`);
        }
      } catch (e) {
        logger.log(e);
      }
    }
  },

  async seedAllType() {
    const { damages, frenchType, englishName } = await pokeApi.getAllTypesData();

    const damageType = {};

    for (let i = 0; i < frenchType.length; i += 1) {
      try {
        const isTypeInDb = await type.findOneByName(frenchType[i].name);

        if (isTypeInDb) {
          logger.log(`type ${frenchType[i].name} already in db`);
        }
        damageType[frenchType[i].name] = damages[i];
      } catch (e) {
        logger.log(e);
      }
    }

    for (let i = 0; i < frenchType.length; i += 1) {
      const noDamageFrom = damageType[frenchType[i].name].no_damage_from.map((typ) => typ.url.split('/')[6]);
      const halfDamageFrom = damageType[frenchType[i].name].half_damage_from.map((typ) => typ.url.split('/')[6]);
      const doubleDamageFrom = damageType[frenchType[i].name].double_damage_from.map((typ) => typ.url.split('/')[6]);
      const id = i + 1;
      const typ = {
        id,
        name: englishName[i],
        frenchName: frenchType[i].name,
        damageFrom: getDamage(noDamageFrom, halfDamageFrom, doubleDamageFrom),
      };

      type.insertType(typ);
    }
    return null;
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
