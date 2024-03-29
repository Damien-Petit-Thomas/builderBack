//* this function set the range of weakness to be considered when suggesting a pokemon
// in the beginning we want to suggest a pokemon that is resistant to the most types
// but as the team is being completed we want to suggest a pokemon that is
// resistant to a most specific type
// for ulterior improvement we could add a parameter to the function to set the range
// in case the user give a team with already > 4 pokemons

function getTeamSuggestion(totalResWeak, numberOfresistance, len) {
  const nbResist = Object.entries(numberOfresistance);
  const total = Object.entries(totalResWeak);
  // const arrSorted = arr.sort((a, b) => a[1] - b[1]);
  const noResist = nbResist.filter((type) => type[1] === 0);
  // const resistSort = nbResist.sort((a, b) => b[1] - a[1]);
  // const weakSort = weak.sort((a, b) => b[1] - a[1]);
  const mostWeak = nbResist.slice(0, 4);
  const strong = total.filter((damage) => damage[1] > 0);
  const tooWeak = total.filter((damage) => damage[1] < 0);
  const weakest = total.sort((a, b) => a[1] - b[1]);
  const limit = total.filter((damage) => damage[1] <= 0);

  const isOneResistance = nbResist.filter((damage) => damage[1] === 1);
  const isAtLeastOneResistance = nbResist.filter((damage) => damage[1] >= 1);
  const isTwoResistance = nbResist.filter((damage) => damage[1] === 2);
  const limitResist = total.filter((type) => type[1] <= 1);

  if (len === 1) {
    const response = {
      noResist,
      weak: [],
    };

    return response;
  }

  if (len === 2 && noResist.length > 0) {
    const response = {
      noResist,
      weak: weakest.splice(0, 4),
    };

    return response;
  }

  if (len === 3 && noResist.length === 0) {
    const response = {
      noResist: isOneResistance,
      weak: [],
    };

    return response;
  }

  if (len === 3 && noResist.length < 3) {
    const response = {
      noResist: noResist.concat(isOneResistance),
      weak: limit,
    };

    return response;
  }

  if (len === 3 && noResist.length >= 3) {
    const response = {
      noResist: mostWeak,
      weak: limit,
    };

    return response;
  }

  if (len === 4 && noResist.length <= 2 && noResist.length > 0) {
    const response = {
      noResist: noResist.concat(isOneResistance),
      weak: limit,
    };

    return response;
  }

  if (len === 4 && noResist.length === 0) {
    const response = {
      noResist: isOneResistance,
      weak: limit,
    };

    return response;
  }

  if (len === 5 && tooWeak.length > 0) {
    const response = {
      noResist: weakest.slice(0, tooWeak.length),
      weak: limit,
    };

    return response;
  }
  if (len === 5 && strong.length === 18) {
    const response = {
      noResist: isTwoResistance,
      weak: limit,
    };

    return response;
  }
  const response = {

    noResist: mostWeak,
    weak: limit,
  };
  return response;
}

module.exports = getTeamSuggestion;
