/* eslint-disable no-await-in-loop */
const logger = require('../../helpers/logger');
const { pokeApi } = require('../../services/pokemon.service/index');

module.exports = async function getFrenchTypesAndDamageFromOnePoke(data) {
  const damage = [];
  const frenchTypes = [];
  const ids = [];
  for (let i = 0; i < data.length; i += 1) {
    try {
      const typeData = await pokeApi.getTypeData(data[i]);
      damage.push(typeData.damage_relations);
      frenchTypes.push(typeData.names.find((name) => name.language.name === 'fr').name);
      ids.push(typeData.id);
    } catch (e) {
      logger.error(e);
    }
  }

  return { damage, frenchTypes, ids };
};
// module.exports = async function getFrenchTypesAndDamageFromOnePoke(englishTypesNames) {
//   const dataType = await Promise.all(englishTypesNames.map(async (names) => {
//     const typeData = await pokeApi.getTypeData(names);
//     const frenchTypes = typeData.names.find((name) => name.language.name === 'fr').name;
//     const ids = typeData.id;

//     return { damage: typeData.damage_relations, frenchTypes, ids };
//   }));
//   return dataType;
// };
