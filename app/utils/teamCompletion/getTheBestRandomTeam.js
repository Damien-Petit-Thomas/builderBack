/* eslint-disable max-len */
/* eslint-disable no-await-in-loop */

const { poke } = require('../../models');
const { totalResistance } = require('./getTeamWeakness');
const { cacheOrFormatPokemon: getPokemon } = require('../pokemon.utils/cacheOrFormatPokemon');
const pokeCache = require('../cache/pokemon.cache').getInstance();

const { ApiError } = require('../../helpers/errorHandler');

async function getTheBestRandomTeam(poketeam) {
  try {
    const len = poketeam.length;
    // Check if the array contains between 1 and 5 Pokemons
    if (len > 5) {
      throw new ApiError('Bad request: The team must contain between 1 and 5 pokemons', { statusCode: 400 });
    }

    // Check if all the Pokemons in the team are different
    if (new Set(poketeam).size !== len) {
      throw new ApiError('Bad request: The team must contain different pokemons', { statusCode: 400 });
    }

    const totalPokemon = await poke.count();
    const allPokemonIds = Array.from({ length: totalPokemon }, (_, i) => i + 1);
    const getAllRandomPokemonId = () => {
      const randomIndex = Math.floor(Math.random() * allPokemonIds.length);
      return allPokemonIds.splice(randomIndex, 1)[0];
    };

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
    // const alreadyUsed = new Set(poketeam);
    let maxIterations = 30000;
    if (len === 5) {
      maxIterations = totalPokemon;
    }

    while ((isNeutral.size < 18 || isResistant.size < 10 || isTooWeak.size > 0) && iterations < maxIterations) {
      const generatedIds = new Set();
      const remainingSlots = 6 - len;

      if (len === 5) {
        while (generatedIds.size < remainingSlots) {
          const randomId = getAllRandomPokemonId();
          generatedIds.add(randomId);
        }
      }

      while (generatedIds.size < remainingSlots) {
        const randomId = getRandomPokemonId();
        if (!poketeam.includes(randomId)) {
          generatedIds.add(randomId);
        }
      }

      const teamWithGeneratedIds = [...poketeam, ...generatedIds];

      teamFormat = await generateFormatedTeam(teamWithGeneratedIds);

      const totalResWeak = totalResistance(teamFormat);
      isNeutral = new Set(Object.keys(totalResWeak).filter((key) => totalResWeak[key] >= 0));
      isResistant = new Set(Object.keys(totalResWeak).filter((key) => totalResWeak[key] > 0));
      isTooWeak = new Set(Object.keys(totalResWeak).filter((key) => totalResWeak[key] < -1));
      if (bestTeam.length === 0
          || isTooWeak.size < bestTeam[0].isTooWeak.size
          || (isTooWeak.size === bestTeam[0].isTooWeak.size && isNeutral.size > bestTeam[0].isNeutral.size)) {
        // console.log(isTooWeak.size, bestTeam[0].isTooWeak.size);
        bestTeam.pop();
        bestTeam.push(
          {
            ...teamFormat,

            isTooWeak,
            isNeutral,
          },
        );
      }
      iterations += 1;

      if (iterations === maxIterations) {
      // Return bestTeam if the condition is not met within the maximum iterations
        console.log('Maximum iterations reached');

        delete bestTeam[0].isTooWeak;
        delete bestTeam[0].isNeutral;

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
