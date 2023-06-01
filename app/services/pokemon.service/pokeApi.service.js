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

  //* method to get all existing types   *//
  // endpoint : https://pokeapi.co/api/v2/type/

  async getAllTypes() {
    const response = await this.get('/type/');

    return response.results;
  }

  //* methode to get  damages, french name and english name of all types  *//
  // indeed, all this data is in the same endpoint

  async getAllTypesData() {
    try {
      const types = await this.getAllTypes();

      const initialData = { damages: [], frenchType: [], englishName: [] };
      const result = await types.reduce(
        async (accPromise, type, index) => {
          //! Important: This condition is used to skip types with an ID > 10000,
          // which helps to prevent bugs: as of the time of writing, there are 18 types
          // with IDs < 10000. Calling getTypeData(19) would result in a 404 error.
          if (Number(type.url.split('/')[6]) > 10000) {
            return accPromise;
          }

          try {
            const acc = await accPromise;
            const typeData = await this.getTypeData(index + 1);

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
