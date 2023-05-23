const getNoDamageFromAndHalfDamageFromToTypes = require('./getImmunizedTypes');

function getTeamSuggestion(damages, i) {
  const arr = Object.entries(damages);
  const arrSorted = arr.sort((a, b) => a[1] - b[1]);
  console.log(arrSorted);

  const toWeak = arr.filter((type) => type[1] === 0);
  console.log(toWeak);
  if (toWeak.length > 0) {
    const weakNess = toWeak.slice(0, 6);
    console.log(weakNess);
    return weakNess;
  }

  if (i < 2) {
    const weakNess = arrSorted.slice(0, 5);
    console.log(weakNess);
    return weakNess;
  }

  if (i < 3) {
    const weakNess = arrSorted.slice(0, 4);
    console.log(weakNess);

    return weakNess;
  }
  if (i < 4) {
    const weakNess = arrSorted.slice(0, 3);
    console.log(weakNess);
    return weakNess;
  }

  if (i < 5) {
    const weakNess = arrSorted.slice(0, 2);
    console.log(weakNess);

    return weakNess;
  }

  if (i < 6) {
    const weakNess = arrSorted.slice(0, 1);
    console.log(weakNess);

    return weakNess;
  }
  return [];
}

module.exports = getTeamSuggestion;
