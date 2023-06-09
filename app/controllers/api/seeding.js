//* Purpose: seeding controller
const buildPokemonFromPokeApi = require('../../utils/pokemon.utils/buildPokemonFromPokeApi');
const {
  poke, type, gen, aby, pokeHasAbi,
} = require('../../models');
const logger = require('../../helpers/logger');
const pokeCache = require('../../utils/cache/pokemon.cache').getInstance();
const seed = require('../../services/pokemon.service/seeding.service');
const { ApiError } = require('../../helpers/errorHandler');
const { pokeApi } = require('../../services/pokemon.service');
const inCache = require('../../utils/cache/inCache');
const formatPoke = require('../../utils/pokemon.utils/getCacheOrFormat');

require('dotenv').config();

module.exports = {

  async seedOnePokemon(req, res) {
    const { id } = req.params;
    const cache = inCache(id, pokeCache);
    if (cache) return res.json(cache);

    const pokemoon = await poke.findByPk(id);
    if (pokemoon) {
      const response = await formatPoke([pokemoon]);
      return res.json(response[0]);
    }

    const { formatedPokemon, pokemon } = await buildPokemonFromPokeApi(id);
    pokeCache.set(pokemon.id, pokemon, pokeCache.TTL);
    if (!formatedPokemon) throw new ApiError('No pokemon found to seed', { statusCode: 404 });
    const pokeSavedInDb = await poke.insertPokemon(formatedPokemon);
    if (!pokeSavedInDb) {
      throw new ApiError('An error occurred while saving the pokemon in the database', { statusCode: 500 });
    }
    return res.json(pokemon);
  },

  async seedAllPokemon(req, res) {
    const allPokemonData = await seed.seedAllPokemon();
    if (!allPokemonData) throw new ApiError('No pokemon found to seed', { statusCode: 404 });
    return res.json(allPokemonData);
  },

  async seedOneType(req, res) {
    const { id } = req.params;
    if (!id) {
      throw new ApiError('id is required', { statusCode: 400 });
    }

    const typ = await type.findByPk(id);
    if (typ) {
      return res.json(typ);
    }
    const typeData = await seed.seedOneTypeById(id);
    if (!typeData) throw new ApiError(`No type found with id ${id}`, { statusCode: 404 });
    return res.json(typeData);
  },

  async  seedTypes(_, res) {
    const types = await seed.seedAllType(res);
    if (!types) throw new ApiError('No types found to seed', { statusCode: 404 });
    return res.json(types);
  },

  async   seedOneAbilities(req, res) {
    const { id } = req.params;
    if (!id) {
      throw new ApiError('id is required', { statusCode: 400 });
    }
    const { abiInDb, data } = await seed.seedOneAbilityById(id);

    if (!data) throw new ApiError(`No ability found with id ${id}`, { statusCode: 404 });
    const result = aby.insertAbility(abiInDb);
    return res.json(result);
  },

  async seedAbilities(_, res) {
    const abilities = await seed.seedAllAbilities();
    if (!abilities) throw new ApiError('No ability found to seed', { statusCode: 400 });
    return res.json(abilities);
  },

  async seedPokemonHasAbility(_, res) {
    const data = await seed.seedPokemonAbility();

    const response = await pokeHasAbi.insertPokemonHasAbility(data);
    if (!response) throw new ApiError('No pokemon ability found to seed', { statusCode: 404 });
    return res.json(response);
  },

  async seedGenerations(_, res) {
    const numberOfGenerations = await pokeApi.getAllGenerationsCount();
    const start = await gen.count();
    const generations = await gen.insertGen(start + 1, numberOfGenerations);
    if (!generations) throw new ApiError('No generations found to seed', { statusCode: 404 });
    return res.json(generations);
  },

  //! Method only here because of change in the db schema now all pokemon have a gen_id column

  async seedGen_idColumn() {
    const generations = await gen.findAll();
    if (!generations) throw new ApiError('No generations found to seed', { statusCode: 404 });
    // we get the generations from the db
    // at each iteration we get all the pokemons from one generation
    // and we push them in the pokemons array
    const promises = generations.map(async (generation, i) => {
      const pokemons = await pokeApi.getAllPokeByGeneration(generation.id);
      const records = pokemons.map((pokemon) => ({
        poke_id: pokemon.url.split('/')[6],
        gen_id: i + 1,
      }));
      return records;
    });
    const allRecords = (await Promise.all(promises)).flat();

    const responses = await poke.updatePokemonGen(allRecords);

    if (responses.some((response) => !response)) {
      throw new ApiError('An error occurred while seeding the gen_id column', { statusCode: 404 });
    }

    return responses;
  },
};
