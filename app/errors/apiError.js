/**
 * implements a custom error class
 */
module.exports = class ApiError extends Error {
  constructor(message, infos) {
    super(message);

    this.name = 'ApiError';

    this.infos = infos;
  }
};
