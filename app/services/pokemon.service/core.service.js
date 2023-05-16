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
};
