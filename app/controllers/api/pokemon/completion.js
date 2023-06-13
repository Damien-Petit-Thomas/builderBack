/* eslint-disable no-await-in-loop */
const { poke, type } = require('../../../models');

const preformatPokemon = require('../../../utils/pokemon.utils/preformatePokemon');
const {
  getNumberOfResistanceByType,
  // getNumberOfWeaknessByType,
  totalResistance,
} = require('../../../utils/teamCompletion/getTeamWeakness');
const getTeamSuggestion = require('../../../utils/teamCompletion/getTeamSuggestion');
const { bestTwoTypes, best4types } = require('../../../utils/teamCompletion/bestTwoTypes');
const { bestPokemon, best2Pokemons } = require('../../../utils/teamCompletion/getBestPokemons');
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
        const len = teamPokemons.length;
        const teamPokemonsIds = teamPokemons.map((pokemon) => pokemon.id);
        // retrieve the number resistance of the team to each type
        const numberOfresistance = getNumberOfResistanceByType(teamPokemons);
        // const weakness = getNumberOfWeaknessByType(teamPokemons);
        const totalResWeak = totalResistance(teamPokemons);

        const isResist = Object.keys(totalResWeak)
          .filter((key) => totalResWeak[key] > 0)
          .map((key) => Number(key));

        // set priority
        const team = getTeamSuggestion(totalResWeak, numberOfresistance, len);

        const resistTypeList = team.noResist.map((w) => w[0]);
        const weakTypeListSorted = team.weak.sort((a, b) => a[1] - b[1]);

        const weakTypeList = weakTypeListSorted.map((w) => w[0]);

        // const typeList = weak.map((w) => w[0]);

        // find the best types to counter the weakness
        let resistantTypes = await type.findResistanceToTypeList(resistTypeList, weakTypeList);
        while (resistantTypes.length < 1) {
          weakTypeList.pop();

          resistantTypes = await type.findResistanceToTypeList(resistTypeList, weakTypeList);
        }
        // find the best pair of types to counter the weakness
        const best2Types = bestTwoTypes(resistantTypes);
        let i = 0;
        if (teamPokemons.length < 5 && i < 5) {
          console.log('000000000000000000000000000000000000000', i, '000000000000000000000000000000000000');
          console.log(teamPokemons.length, 'teamPokemons.length');
          i += 1;
          const best4Types = best4types(best2Types, isResist);
          if (best4Types) {
            let bestPokemons = await best2Pokemons(best4Types, teamPokemonsIds);
            if (bestPokemons) {
              console.log(bestPokemons);
              const formatedPokemon1 = await preformatPokemon(bestPokemons[0]);
              const formatedPokemon2 = await preformatPokemon(bestPokemons[1]);
              teamPokemons.push(formatedPokemon1);
              teamPokemons.push(formatedPokemon2);
              break;
            } else {
              bestPokemons = await bestPokemon(best2Types, teamPokemonsIds);
              if (bestPokemons) {
                const formatedPokemon = await preformatPokemon(bestPokemons);
                teamPokemons.push(formatedPokemon);
                break;
              }
            }
          }
        } else {
          const bestPokemons = await bestPokemon(best2Types, teamPokemonsIds);

          if (bestPokemons) {
            const formatedPokemon = await preformatPokemon(bestPokemons);
            teamPokemons.push(formatedPokemon);
          }
        }
      }

      return res.json(teamPokemons);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },
};
