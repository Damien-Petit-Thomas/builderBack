//* this utils is used to get the french types and damage relations from one pokemon

const logger = require('../../helpers/logger');
const { pokeApi } = require('../../services/pokemon.service/index');

module.exports = async function getFrenchTypesAndDamageFromOnePoke(data) {
  try {
    const initialData = { damage: [], frenchTypes: [], ids: [] };
    // reduce is used to make a single request to the pokeApi
    const result = await data.reduce(async (accPromise, item) => {
      const acc = await accPromise;

      const typeData = await pokeApi.getTypeData(item);
      acc.damage.push(typeData.damage_relations);
      acc.frenchTypes.push(typeData.names.find((name) => name.language.name === 'fr').name);
      acc.ids.push(typeData.id);

      return acc;
    }, Promise.resolve(initialData));
    return result;
  } catch (err) {
    logger.error(err);
    throw err;
  }
};
