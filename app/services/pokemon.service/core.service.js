//* to simplify the code and avoid repeating we create a core service  *//
// we create a GET method that will be used by all other methods

module.exports = class CoreService {
  constructor(axios, logger) {
    this.axios = axios;
    this.logger = logger;
    this.baseUrl = 'https://pokeapi.co/api/v2';
  }

  async get(endpoint) {
    try {
      const response = await this.axios.get(`${this.baseUrl}/${endpoint}`);
      return response.data;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async post(endpoint, data) {
    await this.axios.post(`${this.baseUrl}/${endpoint}`, data)
      .then((response) => response.data);
  }
};
