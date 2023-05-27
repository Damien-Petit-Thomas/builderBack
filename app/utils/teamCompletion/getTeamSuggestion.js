function getTeamSuggestion(damages, i) {
  const arr = Object.entries(damages);
  const arrSorted = arr.sort((a, b) => a[1] - b[1]);

  if (i < 2) {
    const weakNess = arrSorted.slice(0, 5);

    return weakNess;
  }

  if (i < 3) {
    const weakNess = arrSorted.slice(0, 4);

    return weakNess;
  }

  if (i < 5) {
    const weakNess = arrSorted.slice(0, 2);

    return weakNess;
  }

  const weakNess = arrSorted.slice(0, 1);

  return weakNess;
}

module.exports = getTeamSuggestion;
