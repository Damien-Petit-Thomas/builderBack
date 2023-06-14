/* eslint-disable no-await-in-loop */
const formatPoke = require('../../../utils/pokemon.utils/dataMapToFormat');
const { poke } = require('../../../models');
const { totalResistance } = require('../../../utils/teamCompletion/getTeamWeakness');
const { cacheOrFormatPokemon: getPokemon } = require('../../../utils/pokemon.utils/cacheOrFormatPokemon');
const pokeCache = require('../../../utils/cache/pokemon.cache').getInstance();
const inCache = require('../../../utils/cache/inCache');
const { ApiError } = require('../../../helpers/errorHandler');

async function getTheBestRandomTeam(poketeam) {
  try {
    const len = poketeam.length;
    // Check if the array contains between 1 and 5 Pokemons
    if (len < 1 || len > 5) {
      throw new ApiError('Bad request: The team must contain between 1 and 5 pokemons', { statusCode: 400 });
    }

    // Check if all the Pokemons in the team are different
    if (new Set(poketeam).size !== len) {
      throw new ApiError('Bad request: The team must contain different pokemons', { statusCode: 400 });
    }

    const totalPokemon = await poke.count();
    const getRandomPokemonId = () => Math.floor(Math.random() * totalPokemon) + 1;

    const generateFormatedTeam = async (team) => {
      const promises = team.map(async (id) => {
        const result = await getPokemon(id, pokeCache);
        return result;
      });
      const teamPokemons = (await Promise.all(promises)).flat();
      return teamPokemons;
    };

    let teamFormat;
    let isNeutral = new Set();
    let isResistant = new Set();
    let isTooWeak = new Set();
    const bestTeam = [];
    let iterations = 0;

    const maxIterations = 10000;

    while ((isNeutral.size < 18 || isResistant.size < 10 || isTooWeak.size > 0) && iterations < maxIterations) {
      const generatedIds = [];
      const remainingSlots = 6 - poketeam.length;

      while (generatedIds.length < remainingSlots) {
        const randomId = getRandomPokemonId();
        if (!poketeam.includes(randomId) && !generatedIds.includes(randomId)) {
          generatedIds.push(randomId);
        }
      }

      const teamWithGeneratedIds = [...poketeam, ...generatedIds];

      teamFormat = await generateFormatedTeam(teamWithGeneratedIds);

      const totalResWeak = totalResistance(teamFormat);
      isNeutral = new Set(Object.keys(totalResWeak).filter((key) => totalResWeak[key] >= 0));
      isResistant = new Set(Object.keys(totalResWeak).filter((key) => totalResWeak[key] > 0));
      isTooWeak = new Set(Object.keys(totalResWeak).filter((key) => totalResWeak[key] < -1));
      if (bestTeam.length === 0 || isTooWeak.size < bestTeam[0].isTooWeak.size) {
        bestTeam.push(
          {
            ...teamFormat,

            isTooWeak,
          },
        );
      }
      iterations += 1;

      if (iterations === maxIterations) {
      // Return bestTeam if the condition is not met within the maximum iterations
        console.log('Maximum iterations reached');
        return [...Object.values(bestTeam[0])];
      }
    }
    return teamFormat;
  } catch (err) {
    throw new ApiError(err.message, err.infos);
  }
}

module.exports = {
  getTheBestRandomTeam,
};
