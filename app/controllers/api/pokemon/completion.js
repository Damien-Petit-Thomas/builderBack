/* eslint-disable no-await-in-loop */
const { poke, type } = require('../../../models');

const preformatPokemon = require('../../../utils/pokemon.utils/preformatePokemon');
const {
  getNumberOfResistanceByType,
  getNumberOfWeaknessByType,
} = require('../../../utils/teamCompletion/getTeamWeakness');
const getTeamSuggestion = require('../../../utils/teamCompletion/getTeamSuggestion');
const bestTwoTypes = require('../../../utils/teamCompletion/bestTwoTypes');
const getBestPokemons = require('../../../utils/teamCompletion/getBestPokemons');
const { ApiError } = require('../../../helpers/errorHandler');
const inCache = require('../../../utils/cache/inCache');
const pokeCache = require('../../../utils/cache/pokemon.cache').getInstance();
const formatPoke = require('../../../utils/pokemon.utils/dataMapToFormat');

module.exports = {

  async getTeamCompletion(req, res) {
    try {
    // The req.body contains an array with Pokemon IDs
      const poketeam = req.body;

      // Check if the array contains between 1 and 5 Pokemons
      if (poketeam.length < 1 || poketeam.length > 5) {
        throw new ApiError('Bad request : The team must contain between 1 and 5 pokemons', { statusCode: 400 });
      }

      // Check if all the Pokemons in the team are different
      if (new Set(poketeam).size !== poketeam.length) {
        throw new ApiError('Bad request : The team must contain different pokemons', { statusCode: 400 });
      }

      // Retrieve Pokemons from the database or cache and format them
      const promises = poketeam.map(async (id) => {
        const cache = inCache(id, pokeCache);
        if (cache) return cache;

        const inDb = await poke.findByPk(id);
        if (inDb) {
          const formatedPokemon = await preformatPokemon(inDb);
          return formatedPokemon;
        }

        throw new ApiError(` pokemon whith id  ${id} not found `, { statusCode: 404 });
      });

      const teamPokemons = (await Promise.all(promises)).flat();

      while (teamPokemons.length < 6) {
        const teamPokemonsIds = teamPokemons.map((pokemon) => pokemon.id);
        // retrieve the number resistance of the team to each type
        const resistance = getNumberOfResistanceByType(teamPokemons);
        const weakness = getNumberOfWeaknessByType(teamPokemons);
        // get en array of the most weak type the length depend of the number of pokemon in the team
        const team = getTeamSuggestion(weakness, resistance);
        console.log(team);
        const resistTypeList = team.noResist.map((w) => w[0]);
        const weakTypeList = team.weak.map((w) => w[0]);
        // const typeList = weak.map((w) => w[0]);

        const resistantTypes = await type.findResistanceToTypeList(resistTypeList, weakTypeList);

        const bestTypes = bestTwoTypes(resistantTypes);

        const bestPokemons = await getBestPokemons(bestTypes, teamPokemonsIds);

        if (bestPokemons) {
          const formatedPokemon = await preformatPokemon(bestPokemons);
          teamPokemons.push(formatedPokemon);
        }
      }

      return res.json(teamPokemons);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },
};
