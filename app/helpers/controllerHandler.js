const debug = require('debug')('app:helpers:controllerHandler');

/**
 * controllerWrapper for the routes
 * @param {object} controller  to exexute inside a try catch block
 * @return {function}  a controller as a middleware
 */

module.exports = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
    debug(req.url, 'responde');
  } catch (err) {
    next(err);
  }
};
