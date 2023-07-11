//* we create a new instance of the service and export it wiith injectable dependencies  *//
// now we can use the service in our controller

const axios = require('axios');

const PokeApiService = require('./pokeApi.service');

module.exports = {
  pokeApi: new PokeApiService(axios),
};
