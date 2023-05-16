const debug = require('debug')('app:helpers:controllerHandler');

module.exports = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
    debug(req.url, 'responde');
  } catch (err) {
    next(err);
  }
};
