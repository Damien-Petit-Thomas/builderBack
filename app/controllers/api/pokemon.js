require('dotenv').config();

const logger = require('../../helpers/logger');

const { poke } = require('../../models/index.datamapper');

const { type } = require('../../models/index.datamapper');
const buildPokemonObjectFromPokeDb = require('../../utils/pokemon.utils/buildFormatedPokemonFromDb');
const CacheServer = require('../../utils/cache');
const preformatPokemon = require('../../utils/pokemon.utils/preformatePokemon');
const getPokemonFromCache = require('../../utils/pokemon.utils/getPokemonFromCahe');
const { getNumberOfResistanceByType } = require('../../utils/teamCompletion/getTeamWeakness');
const getTeamSuggestion = require('../../utils/teamCompletion/getTeamSuggestion');
const bestTwoTypes = require('../../utils/teamCompletion/bestTwoTypes');
const getBestPokemons = require('../../utils/teamCompletion/getBestPokemons');
const { ApiError } = require('../../helpers/errorHandler');

const cache = CacheServer.getInstance();
module.exports = {

  async getOne(req, res) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'id is required' });
    }
    // on verifie si le pokemon est en cache
    if (getPokemonFromCache(id)) {
      return res.json(getPokemonFromCache(id));
    }
    // on verifie si le pokemon est en base de donnees
    const pokemon = await poke.findByPk(id);
    if (pokemon) {
      const formatedPokemon = await preformatPokemon(pokemon);
      return res.json(formatedPokemon);
    }

    return res.redirect(`/seeding/${id}`);
  },

  async getAll(req, res) {
    // on verifie si les pokemons sont en cache
    const pokemonsInCache = cache.get('all');
    if (pokemonsInCache) {
      logger.log('all pokemons already in cache');
      return res.json(pokemonsInCache);
    }
    const pokemons = await poke.findAll();
    const promises = pokemons.map(async (pokemon) => preformatPokemon(pokemon));

    const allPokemons = await Promise.all(promises);

    // on stocke les pokemons en cache
    cache.set('all', allPokemons, this.TTL);
    logger.log('all pokemons added to cache');
    return res.json(allPokemons);
  },

  async getPokemonByTypeId(req, res) {
    const { id } = req.params;
    if (!id) {
      throw new ApiError('id is required', { statusCode: 400 });
    }
    const pokemons = await poke.findAllByTypeId(id);
    const promises = pokemons.map(async (pokemon) => preformatPokemon(pokemon));
    const allPokemons = await Promise.all(promises);
    if (allPokemons.length === 0) {
      throw new ApiError('no pokemon found', { statusCode: 404 });
    }
    return res.json(allPokemons);
  },
  async getPokemonByTypesIds(req, res) {
    const { id1, id2 } = req.params;
    if (!id1 || !id2) {
      throw new ApiError('id1 and id2 are required', { statusCode: 400 });
    }
    const pokemons = await poke.findAllByTypesIds(id1, id2);
    const promises = pokemons.map(async (pokemon) => preformatPokemon(pokemon));
    const allPokemons = await Promise.all(promises);
    if (allPokemons.length === 0) {
      throw new ApiError('no pokemon found', { statusCode: 404 });
    }
    return res.status(200).json(allPokemons);
  },
  async getPokemonByGenId(req, res) {
    const { id } = req.params;
    if (!id) throw new ApiError('id is required', { statusCode: 400 });
    const pokemons = await poke.findAllByGenId(id);
    if (pokemons.length === 0) throw new ApiError('no pokemon found', { statusCode: 404 });
    const promises = pokemons.map(async (pokemon) => preformatPokemon(pokemon));
    const allPokemons = await Promise.all(promises);
    return res.json(allPokemons);
  },
  async getNoDamageFrom(req, res) {
    const { id } = req.params;
    if (!id) throw new ApiError('id is required', { statusCode: 400 });
    const types = await type.findNoDamageFrom(id);
    if (types.length === 0) throw new ApiError('no type found', { statusCode: 404 });
    const promises = types.map(async (typ) => {
      const pokemons = await poke.findAllByTypeId(typ.id);
      const preformattedPokemons = await Promise.all(
        pokemons.map(async (pokemon) => preformatPokemon(pokemon)),
      );
      return preformattedPokemons;
    });

    const allPokemons = await Promise.all(promises);
    return res.json(allPokemons);
  },
  async getHalfDamageFrom(req, res) {
    const { id } = req.params;
    if (!id) throw new ApiError('id is required', { statusCode: 400 });
    const types = await type.findHalfDamageFrom(id);
    if (types.length === 0) throw new ApiError('no type found', { statusCode: 404 });
    const promises = types.map(async (typ) => {
      const pokemons = await poke.findAllByTypeId(typ.id);
      const preformatePokemons = await Promise.all(
        pokemons.map(async (pokemon) => preformatPokemon(pokemon)),
      );
      return preformatePokemons;
    });
    const allPokemons = await Promise.all(promises);
    return res.json(allPokemons);
  },

  async getNoDamageFromOrHalfDamageFrom(req, res) {
    const { id } = req.params;
    if (!id) throw new ApiError('id is required', { statusCode: 400 });
    const types = await type.findNoDamageFromAndHalfDamageFrom(id);
    if (types.length === 0) throw new ApiError('no type found', { statusCode: 404 });
    const promises = await types.map(async (typ) => {
      const pokemons = await poke.findAllByTypeId(typ.id);
      const preformatePokemons = await Promise.all(
        pokemons.map(async (pokemon) => preformatPokemon(pokemon)),
      );
      return preformatePokemons;
    });
    const allPokemons = await Promise.all(promises);
    return res.json(allPokemons);
  },
  // async getNoDamageFromAndHalfDamageFromToTypes(req, res) {
  //   const { typeId1, typeId2 } = req.params;
  //   const typeName1 = await type.findByPk(typeId1);
  //   const typeName2 = await type.findByPk(typeId2);
  //   const imune1 = await poke.findNoDamageFrom(typeName1.id);
  //   const imune2 = await poke.findNoDamageFrom(typeName2.id);
  //   const resist1 = await poke.findHalfDamageFrom(typeName1.id);
  //   const resist2 = await poke.findHalfDamageFrom(typeName2.id);
  //   const result = imune1.concat(imune2, resist1, resist2);
  //   return res.json(result);
  // },
  async getOneByName(req, res) {
    const { name } = req.params;
    if (!name) throw new ApiError('name is required', { statusCode: 400 });
    const pokemon = await poke.findOneByName(name);
    if (!pokemon) throw new ApiError('no pokemon found', { statusCode: 404 });

    // on cree un tableau vide pour stocker les types
    logger.log(`pokemon ${name} already exist in db`);
    const pokemonType = [];
    pokemonType.push(pokemon.type1);
    if (pokemon.type2) {
      pokemonType.push(pokemon.type2);
    }

    // on recupere les données de degats pour chaque type
    const promises = pokemonType.map(async (typeId) => {
      const damage = await type.findByPk(typeId);
      return damage.damagefrom;
    });
    const totalDamage = await Promise.all(promises);
    const formatedPokemon = buildPokemonObjectFromPokeDb(pokemon, totalDamage);
    // on stocke le pokemon en cache
    cache.set(pokemon.id, formatedPokemon, this.TTL);
    logger.log(`pokemon ${req.params.id} added to cache`);
    return res.json(formatedPokemon);
  },
  async getFullRandomTeam(_, res) {
    const randomIds = await poke.getRandomTeam();
    const promises = randomIds.map(async (id) => {
      if (cache.get(id.id)) return cache.get(id.id);
      const pokemon = await poke.findByPk(id.id);
      const formatedPokemon = await preformatPokemon(pokemon);
      return formatedPokemon;
    });
    const randomTeam = await Promise.all(promises);
    return res.json(randomTeam);
  },

  async getTeamCompletion(req, res) {
    // le req.body contient un tableau avec les ids des pokemons
    // return res.json(req.body);
    const poketeam = req.body;

    // on vérifie que le tableau contient entre 1 et 5 pokemons
    if (poketeam.length < 1 || poketeam.length > 5) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'The req body must contain between 1 and 5 pokemons',
      });
    }

    // on verifie que les pokemons sont tous différents
    if (new Set(poketeam).size !== poketeam.length) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'The req body must contain different pokemons',
      });
    }
    // on recupere les pokemons depuis la base de données

    const promises = poketeam.map(async (id) => {
      const inCache = cache.get(id);
      if (inCache) return inCache;
      const inDb = await poke.findByPk(id);

      if (inDb) {
        const formatedPokemon = await preformatPokemon(inDb);
        return formatedPokemon;
      }
      return res.status(400).json({
        error: 'Bad request',
        message: 'unknow pokemon',
      });
    });

    const teamPokemons = (await Promise.all(promises)).flat();

    while (teamPokemons.length < 6) {
      const weakNess = getNumberOfResistanceByType(teamPokemons);
      const weak = getTeamSuggestion(weakNess, teamPokemons.length);

      const typeList = [];
      for (let i = 0; i < weak.length; i += 1) {
        typeList.push(weak[i][0]);
      }
      // const index = [];
      // for (let i = 0; i < weak.length; i += 1) {
      //   index.push(i);
      // }

      try {
        const resistantTypes = await type.findResistanceToTypeList(typeList);

        const bestTypes = bestTwoTypes(resistantTypes);

        const bestPokemons = await getBestPokemons(bestTypes);

        if (bestPokemons) {
          const formatedPokemon = await preformatPokemon(bestPokemons[0]);
          teamPokemons.push(formatedPokemon);
        }
      } catch (err) {
        res.status(400).json({
          error: 'Bad request',
          message: 'something went wrong',
        });
      }
    }

    return res.json(teamPokemons);
  },
};