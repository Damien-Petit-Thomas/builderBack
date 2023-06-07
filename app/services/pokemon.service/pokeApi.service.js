//* this service is used to get data from the pokeApi  *//
const CoreService = require('./core.service');
const logger = require('../../helpers/logger');
const { ApiError } = require('../../helpers/errorHandler');

module.exports = class PokemonService extends CoreService {
  //* method to get the pokemon stats types id ...   *//
// endpoint : https://pokeapi.co/api/v2/pokemon/{id || name}/

  async getPokemonData(nameOrId) {
    const response = await this.get(`/pokemon/${nameOrId}`);
    return response;
  }

  //* method to get the number of existing generation  *//
  // endpoint : https://pokeapi.co/api/v2/generation/

  async getAllGenerationsCount() {
    const response = await this.get('/generation');
    return response.count;
  }

  //* method to get all pokemon of a generation by generation id  *//
  // endpoint : https://pokeapi.co/api/v2/generation/{id}/

  async getAllPokeByGeneration(id) {
    const response = await this.get(`/generation/${id}`);
    return response.pokemon_species;
  }

  //* method to get the french name and generation of a pokemon by pokemon id  *//
  // the gen is retrieved from the generation url in the response
  // endpoint : https://pokeapi.co/api/v2/pokemon-species/{id}/

  async getFrenchName(id) {
    const response = await this.get(`/pokemon-species/${id}`);
    const frenchName = response.names.find((name) => name.language.name === 'fr').name;
    const gen = response.generation.url.split('/')[6];

    return { frenchName, gen };
  }

  //* method to get the type data by type name  *//
  // endpoint : https://pokeapi.co/api/v2/type/{name}/

  async getTypeData(typeNameORId) {
    const response = await this.get(`/type/${typeNameORId}`);

    return response;
  }

  //* method to get  all existing types   *//
  // endpoint : https://pokeapi.co/api/v2/type/?limit=1000

  async getAllTypes() {
    const response = await this.get('/type/');
    return response.results;
  }

  //* method to get the  all existing abilities   *//
  // endpoint : https://pokeapi.co/api/v2/ability/?limit=10000
  async getAllAbilities() {
    const response = await this.get('/ability/?limit=10000');

    return response.results;
  }

  async getAbilityData(abilityNameORId) {
    const response = await this.get(`/ability/${abilityNameORId}`);
    const { id } = response;
    const { name } = response;
    const frenchName = response.names.find((nam) => nam.language.name === 'fr').name;
    const description = response.flavor_text_entries.filter((desc) => desc.language.name === 'fr').pop()?.flavor_text ?? 'No description';
    const pokemons = [...new Set(response.pokemon.map((pokemon) => (pokemon.pokemon.url.split('/')[6])))]
      .filter((poke) => poke < 10000);

    return {
      id, name, frenchName, pokemons, description,
    };
  }

  async getAllAbilitiesData() {
    try {
      const abilities = await this.getAllAbilities();
      const result = await abilities.reduce(
        async (accPromise, ability) => {
          const id = ability.url.split('/')[6];
          if (id >= 10000) {
            return accPromise;
          }
          try {
            const acc = await accPromise;
            const abilityData = await this.getAbilityData(id);

            const abi = {
              id: abilityData.id,
              name: abilityData.name,
              frenchName: abilityData.frenchName,
              description: abilityData.description,
              pokemons: abilityData.pokemons,
            };

            acc.push(abi);

            return acc;
          } catch (err) {
            logger.error(err);
            throw new ApiError(err.message, err.info);
          }
        },
        Promise.resolve([]),
      );

      return result;
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.info);
    }
  }

  //* methode to get  damages, french name and english name of all types  *//
  // indeed, all this data is in the same endpoint

  async getAllTypesData() {
    try {
      const types = await this.getAllTypes();

      const initialData = { damages: [], frenchType: [], englishName: [] };
      const result = await types.reduce(
        async (accPromise, type) => {
          //! Important: This condition is used to skip types with an ID > 10000,
          // which helps to prevent bugs: as of the time of writing, there are 18 types
          // with IDs < 10000. Calling getTypeData(19) would result in a 404 error.

          try {
            const id = type.url.split('/')[6];
            if (id > 10000) {
              return accPromise;
            }
            const acc = await accPromise;
            const typeData = await this.getTypeData(id);

            acc.damages.push(typeData.damage_relations);
            acc.frenchType.push(typeData.names.find((name) => name.language.name === 'fr'));
            acc.englishName.push(type.name);

            return acc;
          } catch (error) {
            throw new Error('Error in type iteration', { statusCode: 500 });
          }
        },
        Promise.resolve(initialData),
      );

      return result;
    } catch (err) {
      logger.error(err);
      throw new ApiError(err.message, err.info);
    }
  }
};
