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
  // const tooWeak = total.filter((damage) => damage[1] < 0);
  // const limit = weak.filter((damage) => damage[1] === 0);
  const isOneResistance = nbResist.filter((damage) => damage[1] === 1);
  const limitResist = total.filter((type) => type[1] <= 1);

  if (len < 3) {
    const response = {
      noResist,
      weak: [],
    };

    return response;
  }

  // if (noResist.length > 8) {
  //   const response = {
  //     noResist,
  //     weak: limitResist,

  //   };

  //   return response;
  // }
  // if (noResist.length > 4) {
  //   const response = {
  //     noResist,
  //     weak: limitResist,

  //   };

  //   return response;
  // }

  // if (noResist.length > 0) {
  //   const response = {
  //     noResist,

  //     weak: limitResist,

  //   };

  //   return response;
  // }

  if (isOneResistance.length > 0) {
    const response = {
      noResist: isOneResistance,
      weak: limitResist,
    };
    return response;
  }
  const response = {
    noResist: mostWeak,
    weak: limitResist,

  };

  return response;
}

module.exports = getTeamSuggestion;
