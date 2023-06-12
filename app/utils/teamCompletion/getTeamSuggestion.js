//* this function set the range of weakness to be considered when suggesting a pokemon
// in the beginning we want to suggest a pokemon that is resistant to the most types
// but as the team is being completed we want to suggest a pokemon that is
// resistant to a most specific type
// for ulterior improvement we could add a parameter to the function to set the range
// in case the user give a team with already > 4 pokemons

function getTeamSuggestion(weakness, resistance) {
  const resist = Object.entries(resistance);
  // const arrSorted = arr.sort((a, b) => a[1] - b[1]);
  const noResist = resist.filter((damage) => damage[1] === 0);
  const weak = Object.entries(weakness);
  const resistSort = resist.sort((a, b) => b[1] - a[1]);
  const weakSort = weak.sort((a, b) => b[1] - a[1]);
  const mostWeak = weakSort.slice(0, 4);

  if (noResist.length > 12) {
    const response = {
      noResist,
      weak: [],
    };

    return response;
  }

  if (noResist.length > 8) {
    const response = {
      noResist,
      weak: mostWeak,

    };

    return response;
  }

  if (noResist.length > 0) {
    const response = {
      noResist,
      needResist: resistSort.slice(0, 4),
      weak: mostWeak,
    };

    return response;
  }

  const response = {
    noResist: resistSort.slice(0, 5),
    weak: mostWeak,
  };

  return response;
}

module.exports = getTeamSuggestion;
