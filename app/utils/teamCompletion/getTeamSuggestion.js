//* this function set the range of weakness to be considered when suggesting a pokemon
// in the beginning we want to suggest a pokemon that is resistant to the most types
// but as the team is being completed we want to suggest a pokemon that is
// resistant to a most specific type
// for ulterior improvement we could add a parameter to the function to set the range
// in case the user give a team with already > 4 pokemons
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
