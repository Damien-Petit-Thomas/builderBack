//* to simplify the code and avoid repeating we create a core service  *//
// we create a GET method that will be used by all other methods
const { ApiError } = require('../../helpers/errorHandler');

module.exports = class CoreService {
  constructor(axios) {
    this.axios = axios;
    this.baseUrl = 'https://pokeapi.co/api/v2';
  }

  async get(endpoint) {
    const response = await this.axios.get(`${this.baseUrl}/${endpoint}`);
    return response.data;
  }

  async post(endpoint, data) {
    await this.axios.post(`${this.baseUrl}/${endpoint}`, data)
      .then((response) => response.data);
  }
};
