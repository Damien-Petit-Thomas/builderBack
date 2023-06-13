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

module.exports = {
  async getTeamCompletion(req, res) {
    try {
      // The req.body contains an array with Pokemon IDs
      const poketeam = req.body;

      // Check if the array contains between 1 and 5 Pokemons
      if (poketeam.length < 1 || poketeam.length > 5) {
        throw new ApiError('Bad request: The team must contain between 1 and 5 pokemons', { statusCode: 400 });
      }

      // Check if all the Pokemons in the team are different
      if (new Set(poketeam).size !== poketeam.length) {
        throw new ApiError('Bad request: The team must contain different pokemons', { statusCode: 400 });
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

        throw new ApiError(`Pokemon with id ${id} not found`, { statusCode: 404 });
      });
      const teamPokemons = (await Promise.all(promises)).flat();

      const completeTeam = async () => {
        let best4Types;
        const teamPokemonsIds = teamPokemons.map((pokemon) => pokemon.id);
        const numberOfresistance = getNumberOfResistanceByType(teamPokemons);

        const totalResWeak = totalResistance(teamPokemons);

        const isResist = Object.keys(totalResWeak)
          .filter((key) => totalResWeak[key] > 0)
          .map((key) => Number(key));

        const team = getTeamSuggestion(totalResWeak, numberOfresistance, teamPokemons.length);
        const resistTypeList = team.noResist.map((w) => w[0]);
        const weakTypeListSorted = team.weak.sort((a, b) => a[1] - b[1]);
        const weakTypeList = weakTypeListSorted.map((w) => w[0]);
        let resistantTypes = await type.findResistanceToTypeList(resistTypeList, weakTypeList);

        while (resistantTypes.length < 1 && weakTypeList.length > 0) {
          weakTypeList.pop();
          resistantTypes = await type.findResistanceToTypeList(resistTypeList, weakTypeList);
        }

        const best2Types = bestTwoTypes(resistantTypes);

        switch (teamPokemons.length) {
          case 1: {
            let i = 0;
            console.log('case 1');
            best4Types = best4types(best2Types, isResist);
            let isGood = false;
            while (best4Types && !isGood) {
              const bestPokemons = await best2Pokemons(best4Types, teamPokemonsIds);
              if (bestPokemons) {
                const formatedPokemon1 = await preformatPokemon(bestPokemons[0]);
                const formatedPokemon2 = await preformatPokemon(bestPokemons[1]);
                teamPokemons.push(formatedPokemon1);
                teamPokemons.push(formatedPokemon2);
                best4Types = best4Types.slice(1);
                const notAllResist = Object.entries(totalResistance(teamPokemons))
                  .filter((e) => e[1] < 0);

                if (notAllResist.length > 2 && i < 5) {
                  i += 1;
                  console.log(i, 'je suis le i qui se console.log(i)');
                  console.log('RAAAAAAAAAAAAAAAAAAAAAAAAAAAATTTTTTTTTTTTTTTTTTTTTTTTTEEEEEEEEEEEEEEEE');

                  teamPokemons.pop();
                  teamPokemons.pop();
                  console.log(isGood);
                } else {
                  isGood = true;
                }
              }
            }

            if (!best4Types) {
              console.log('pas de best4Types pour 1 pokemon');
              const bestPokemons = await bestPokemon(best2Types, teamPokemonsIds);

              if (bestPokemons) {
                const formatedPokemon = await preformatPokemon(bestPokemons);
                teamPokemons.push(formatedPokemon);
              }
            }

            break;
          }

          case 2: {
            console.log('case 2');
            best4Types = best4types(best2Types, isResist);
            if (!best4Types) {
              const bestPokemons = await bestPokemon(best2Types, teamPokemonsIds);

              if (bestPokemons) {
                const formatedPokemon = await preformatPokemon(bestPokemons);
                teamPokemons.push(formatedPokemon);
              }
            } else if (best4Types) {
              const bestPokemons = await best2Pokemons(best4Types, teamPokemonsIds);
              if (bestPokemons) {
                const formatedPokemon1 = await preformatPokemon(bestPokemons[0]);
                const formatedPokemon2 = await preformatPokemon(bestPokemons[1]);
                teamPokemons.push(formatedPokemon1);
                teamPokemons.push(formatedPokemon2);
              }
            }
            break;
          }
          case 3: {
            let i = 0;
            console.log('case 3');
            best4Types = best4types(best2Types, isResist);
            let isGood = false;
            while (best4Types && !isGood) {
              const bestPokemons = await best2Pokemons(best4Types, teamPokemonsIds);
              if (bestPokemons) {
                const formatedPokemon1 = await preformatPokemon(bestPokemons[0]);
                const formatedPokemon2 = await preformatPokemon(bestPokemons[1]);
                teamPokemons.push(formatedPokemon1);
                teamPokemons.push(formatedPokemon2);
                best4Types = best4Types.slice(1);
                const notAllResist = Object.entries(totalResistance(teamPokemons))
                  .filter((e) => e[1] < 0);

                if (notAllResist.length > 0 && i < 5) {
                  console.log('RAAAAAAAAAAAAAAAAAAAAAAAAAAAATTTTTTTTTTTTTTTTTTTTTTTTTEEEEEEEEEEEEEEEE');
                  i += 1;
                  teamPokemons.pop();
                  teamPokemons.pop();
                  console.log(isGood);
                } else {
                  isGood = true;
                }
              }
            }

            if (!best4Types) {
              const bestPokemons = await bestPokemon(best2Types, teamPokemonsIds);

              if (bestPokemons) {
                const formatedPokemon = await preformatPokemon(bestPokemons);
                teamPokemons.push(formatedPokemon);
              }
            }

            break;
          }

          case 4: {
            best4Types = best4types(best2Types, isResist);
            if (!best4Types) {
              const bestPokemons = await bestPokemon(best2Types, teamPokemonsIds);

              if (bestPokemons) {
                const formatedPokemon = await preformatPokemon(bestPokemons);
                teamPokemons.push(formatedPokemon);
                console.log(teamPokemons.length);
              }
            } else {
              const bestPokemons = await best2Pokemons(best4Types, teamPokemonsIds);
              if (bestPokemons) {
                const formatedPokemon1 = await preformatPokemon(bestPokemons[0]);
                const formatedPokemon2 = await preformatPokemon(bestPokemons[1]);
                teamPokemons.push(formatedPokemon1);
                teamPokemons.push(formatedPokemon2);
                console.log(teamPokemons.length);
              }
            }
            break;
          }

          case 5: {
            const bestPokemons = await bestPokemon(best2Types, teamPokemonsIds);

            if (bestPokemons) {
              const formatedPokemon = await preformatPokemon(bestPokemons);
              teamPokemons.push(formatedPokemon);
            }
            break;
          }

          default:
            break;
        }

        if (teamPokemons.length < 6) {
          await completeTeam();
        }
      };

      await completeTeam();

      return res.json(teamPokemons);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },
};