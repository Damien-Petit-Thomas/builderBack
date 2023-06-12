// eslint-disable-next-line max-len
/* eslint-disable no-await-in-loop */ //! here we need a for loop : we don't to run concurrently the requests
//* this function retrieve the pokemon woth a maximum resistance where it's needed
const { poke } = require('../../models');

module.exports = async function bestPokemon(bestTypes, teamPokemonsIds) {
  for (let i = 0; i < bestTypes.length; i += 1) {
    const { type_ids: [id1, id2] } = bestTypes[i];

    let bestPokemons;

    if (id2 === undefined) {
      bestPokemons = await poke.findAllByTypeId1(id1);
    } else if (id1 === undefined) {
      bestPokemons = await poke.findAllByTypeId1(id2);
    } else {
      bestPokemons = await poke.findBestPokemonByTypesIds(id1, id2);
    }

    if (bestPokemons && !teamPokemonsIds.includes(bestPokemons.id)) {
      return bestPokemons;
    }
  }

  return [];
};
