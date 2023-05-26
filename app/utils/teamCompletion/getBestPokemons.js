/* eslint-disable no-await-in-loop */
const { poke } = require('../../models/index.datamapper');

module.exports = async function bestPokemon(arr, temPokemonsIds) {
  for (let i = 0; i < arr.length; i += 1) {
    const id1 = arr[i].type_ids[0];
    const id2 = arr[i].type_ids[1];
    const bestPokemons = await poke.findBestPokemonByTypesIds(id1, id2);

    if (bestPokemons.length > 0 && !temPokemonsIds.includes(bestPokemons[0].id)) {
      return bestPokemons;
    }
  } return [];
};
