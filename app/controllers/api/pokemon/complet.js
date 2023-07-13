/* eslint-disable no-await-in-loop */
const { poke, type } = require('../../../models');
const { getTheBestRandomTeam } = require('../../../utils/teamCompletion/getTheBestRandomTeam');
const {
  getNumberOfResistanceByType,
  totalResistance,
} = require('../../../utils/teamCompletion/getTeamWeakness');
const getTeamSuggestion = require('../../../utils/teamCompletion/getTeamSuggestion');
const { bestTwoTypes, best4types, combinationsOf2 } = require('../../../utils/teamCompletion/bestTwoTypes');
const { bestPokemon, best2Pokemons } = require('../../../utils/teamCompletion/getBestPokemons');
const { ApiError } = require('../../../helpers/errorHandler');
const pokeCache = require('../../../utils/cache/pokemon.cache').getInstance();
const { cacheOrFormatPokemon: getPokemon } = require('../../../utils/pokemon.utils/cacheOrGetPokemonAndFormat');

module.exports = {
  async getTeamCompletion(req, res) {
    // The req.body contains an array with Pokemon IDs
    const poketeam = req.body;
    // Check if the array contains between 1 and 5 Pokemons
    if (poketeam.length > 5) {
      throw new ApiError('Bad request: The team must contain 5 pokemons maximum', { statusCode: 400 });
    }

    // Check if all the Pokemons in the team are different
    if (new Set(poketeam).size !== poketeam.length) {
      throw new ApiError('Bad request: The team must contain different pokemons', { statusCode: 400 });
    }

    if (poketeam.length === 0) {
      const firstPokemon = await poke.findRandomOne();
      poketeam.push(firstPokemon.id);
    }

    const promises = poketeam.map(async (id) => {
      const result = await getPokemon(id, pokeCache);

      return result;
    });

    let teamPokemons = (await Promise.all(promises)).flat();

    const completeTeam = async () => {
      let best4Types;
      const numberOfresistance = getNumberOfResistanceByType(teamPokemons);

      const toralRes = totalResistance(teamPokemons);

      const isResist = Object.keys(toralRes)
        .filter((key) => toralRes[key] > 0)
        .map((key) => Number(key));

      const team = getTeamSuggestion(toralRes, numberOfresistance, teamPokemons.length);
      const noResisTypeList = team.noResist.map((w) => w[0]);
      const weakTypeListSorted = team.weak.sort((a, b) => a[1] - b[1]);
      const weakTypeList = weakTypeListSorted.map((w) => w[0]);

      let resistantTypes = await type.findResistanceToTypeList(noResisTypeList, weakTypeList);

      while (resistantTypes.length < 1) {
        weakTypeList.pop();

        resistantTypes = await type.findResistanceToTypeList(noResisTypeList, weakTypeList);
      }

      const best2Types = bestTwoTypes(resistantTypes);

      if (teamPokemons.length <= 2) {
        let i = 0;

        best4Types = combinationsOf2(best4types(best2Types, isResist));

        let isGood = false;
        while (best4Types && !isGood) {
          const bestPokemons = await best2Pokemons(best4Types, poketeam);
          if (bestPokemons) {
            const formatedPokemon1 = await getPokemon(bestPokemons[0].id, pokeCache);
            const formatedPokemon2 = await getPokemon(bestPokemons[1].id, pokeCache);
            teamPokemons.push(formatedPokemon1, formatedPokemon2);
            best4Types = best4Types.slice(1);
            const notAllResist = Object.entries(totalResistance(teamPokemons))
              .filter((e) => e[1] < 0);

            if (notAllResist.length > 2 && i < 5) {
              i += 1;

              teamPokemons.pop();
              teamPokemons.pop();
            } else {
              isGood = true;
            }
          }
        }

        if (!best4Types) {
          const bestPokemons = await bestPokemon(best2Types, poketeam);

          if (bestPokemons) {
            const formatedPokemon = await getPokemon(bestPokemons.id, pokeCache);
            teamPokemons.push(formatedPokemon);
          }
        }
      }

      // if (teamPokemons.length === 2) {
      //   let i = 0;

      //   best4Types = combinationsOf2(best4types(best2Types, isResist));

      //   let isGood = false;
      //   while (best4Types && !isGood) {
      //     const bestPokemons = await best2Pokemons(best4Types, poketeam);

      //     if (bestPokemons) {
      //       console.log('bestPokemons', bestPokemons);
      //       const formatedPokemon1 = await getPokemon(bestPokemons[0].id, pokeCache);
      //       if (bestPokemons[1]) {
      //         const formatedPokemon2 = await getPokemon(bestPokemons[1].id, pokeCache);
      //         teamPokemons.push(formatedPokemon2);
      //       }

      //       teamPokemons.push(formatedPokemon1);
      //       best4Types = best4Types.slice(1);
      //       const notAllResist = Object.entries(totalResistance(teamPokemons))
      //         .filter((e) => e[1] < 0);

      //       if (notAllResist.length > 2 && i < 5) {
      //         i += 1;

      //         teamPokemons.pop();
      //         teamPokemons.pop();
      //       } else {
      //         isGood = true;
      //       }
      //     }
      //   }

      //   if (!best4Types) {
      //     const bestPokemons = await bestPokemon(best2Types, poketeam);
      //     console.log('coucous', bestPokemons);
      //     if (bestPokemons) {
      //       const formatedPokemon = await getPokemon(bestPokemons.id, pokeCache);
      //       teamPokemons.push(formatedPokemon);
      //     }
      //   }
      // }
      if (teamPokemons.length > 2) {
        const ids = teamPokemons.map((p) => p.id);
        teamPokemons = await getTheBestRandomTeam(ids);

        return teamPokemons;
      }

      if (teamPokemons.length < 6) {
        return completeTeam();
      }

      return teamPokemons;
    };

    await completeTeam();

    return res.json(teamPokemons);
  },
};
