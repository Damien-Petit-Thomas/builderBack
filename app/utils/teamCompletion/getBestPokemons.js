/* eslint-disable no-await-in-loop */
const { poke } = require('../../models/index.datamapper');

module.exports = async function bestPokemon(arr, teamPokemonsIds) {
  for (let i = 0; i < arr.length; i += 1) {
    const id1 = arr[i].type_ids[0];
    const id2 = arr[i].type_ids[1];
    const bestPokemons = await poke.findBestPokemonByTypesIds(id1, id2);

    if (bestPokemons && !teamPokemonsIds.includes(bestPokemons.id)) {
      return bestPokemons;
    }
  } return [];
};
