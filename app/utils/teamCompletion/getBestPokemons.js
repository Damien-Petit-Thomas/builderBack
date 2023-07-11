// eslint-disable-next-line max-len
/* eslint-disable no-await-in-loop */ //! here we need a for loop : we don't want to run concurrently the requests
//* this function retrieve the pokemon woth a maximum resistance where it's needed
const { poke } = require('../../models');

module.exports = {
  async  bestPokemon(bestTypes, teamPokemonsIds) {
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
  },
  async best2Pokemons(best4Types, teamPokemonsIds) {
    for (let i = 0; i < best4Types.length; i += 1) {
      const poke1 = best4Types[i].pair1;
      const poke2 = best4Types[i].pair2;

      const pokemon1 = await poke.findBestPokemonByTypesIds(poke1[0], poke1[1]);

      if (pokemon1 && poke2) {
        const pokemon2 = await poke.findBestPokemonByTypesIds(poke2[0], poke2[1]);

        if (pokemon2 && !teamPokemonsIds.includes(pokemon1.id)
                     && !teamPokemonsIds.includes(pokemon2.id)) {
          return [pokemon1, pokemon2];
        }
      } else if (pokemon1 && !teamPokemonsIds.includes(pokemon1.id)) {
        return [pokemon1];
      }
    }
    return [];
  },

};
