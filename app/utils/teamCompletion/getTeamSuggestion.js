const getNoDamageFromAndHalfDamageFromToTypes = require('./getImmunizedTypes');

function getTeamSuggestion(damages, i) {
  const arr = Object.entries(damages);
  const arrSorted = arr.sort((a, b) => a[1] - b[1]);
  console.log(arrSorted);

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
}

module.exports = getTeamSuggestion;
