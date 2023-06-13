/* eslint-disable no-await-in-loop */
const formatPoke = require('../../../utils/pokemon.utils/dataMapToFormat');
const {
  poke, team,
} = require('../../../models');
const {

  // getNumberOfWeaknessByType,
  totalResistance,
} = require('../../../utils/teamCompletion/getTeamWeakness');
const pokeCache = require('../../../utils/cache/pokemon.cache').getInstance();

const inCache = require('../../../utils/cache/inCache');
const { ApiError } = require('../../../helpers/errorHandler');

async function getTheBestRandomTeam(poketeam) {
  try {
    // Check if the array contains between 1 and 5 Pokemons
    if (poketeam.length < 1 || poketeam.length > 5) {
      throw new ApiError('Bad request: The team must contain between 1 and 5 pokemons', { statusCode: 400 });
    }

    // Check if all the Pokemons in the team are different
    if (new Set(poketeam).size !== poketeam.length) {
      throw new ApiError('Bad request: The team must contain different pokemons', { statusCode: 400 });
    }

    const totalPokemon = await poke.count();
    const getRandomPokemonId = () => Math.floor(Math.random() * totalPokemon) + 1;

    const generateFormatedTeam = async (team) => {
      while (team.length < 6) {
        team.push(getRandomPokemonId());
      }
      const promises = team.map(async (id) => {
        const cache = inCache(id, pokeCache);
        if (cache) return cache;

        const inDb = await poke.findByPk(id);
        if (inDb) {
          const formatedPokemon = await formatPoke([inDb]);
          return formatedPokemon;
        }
      });
      const teamPokemons = (await Promise.all(promises)).flat();
      return teamPokemons;
    };

    let teamFormat;
    let isNeutral = [];
    let isResistant = [];
    let isTooWeak = [];
    // Generate a team until the condition is met or a maximum number of iterations is reached
    let iterations = 0;
    const maxIterations = 100000;
    // Set a maximum number of iterations to avoid potential infinite loop

    while ((isNeutral.length < 18 || isResistant.length < 10 || isTooWeak.length > 0) && iterations < maxIterations) {
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
      // console.log(totalResWeak);
      isNeutral = Object.keys(totalResWeak)
        .filter((key) => totalResWeak[key] >= 0);

      console.log('---------------------------------------------------------');
      console.log(isNeutral.length, 'isNeutral.length');
      isResistant = Object.keys(totalResWeak)
        .filter((key) => totalResWeak[key] > 0);
      console.log('---------------------------------------------------------');
      console.log(isResistant.length, 'isResistant.length');
      isTooWeak = Object.keys(totalResWeak)
        .filter((key) => totalResWeak[key] < -1);
      console.log('---------------------------------------------------------');
      console.log(isTooWeak.length, 'isTooWeak.length');
      iterations += 1;
    }

    if (iterations === maxIterations) {
      // Return a default value or handle the
      // case when the condition is not met within the maximum iterations
      return null;
    }

    return teamFormat;
  } catch (err) {
    throw new ApiError(err.message, err.infos);
  }
}

module.exports = {
  getTheBestRandomTeam,
};
