// const getNoDamageFromAndHalfDamageFromToTypes = require('./getImmunizedTypes');

function getTeamSuggestion(damages, i) {
  const arr = Object.entries(damages);
  const arrSorted = arr.sort((a, b) => a[1] - b[1]);

  const weakNess = arrSorted.slice(0, 4);

  // case 4:
  //   return getNoDamageFromAndHalfDamageFromToTypes(arrSorted);
  // case 3:
  //   return getNoDamageFromAndHalfDamageFromToTypes(arrSorted);
  // case 2:
  //   return getNoDamageFromAndHalfDamageFromToTypes(arrSorted);
  // case 1:
  //   return getNoDamageFromAndHalfDamageFromToTypes(arrSorted);

  return weakNess;
}
//

module.exports = getTeamSuggestion;
