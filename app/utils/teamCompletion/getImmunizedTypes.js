const { poke } = require('../../models/index.datamapper');

module.exports = async (type1Name, type2Name) => {
  const imune1 = await poke.findNoDamageFrom(type1Name);
  const imune2 = await poke.findNoDamageFrom(type2Name);
  const resist1 = await poke.findHalfDamageFrom(type1Name);
  const resist2 = await poke.findHalfDamageFrom(type2Name);
  const result = imune1.concat(imune2, resist1, resist2);
  return (result);
};
