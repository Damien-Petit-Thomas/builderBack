const getNoDamageFromAndHalfDamageFromToTypes = require('./getImmunizedTypes');

module.exports = async (damages, i) => {
  damages.sort((a, b) => b.damage - a.damage);

  const [type1, type2] = damages.slice(0, 2).map((type) => type.name);

  const immunizedTypes = await getNoDamageFromAndHalfDamageFromToTypes(type1, type2);

  return damages;
};
