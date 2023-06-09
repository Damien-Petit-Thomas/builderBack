const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('../../helpers/logger');
const { ApiError } = require('../../helpers/errorHandler');
const blackList = require('../../utils/cache/blackList.cache').getInstance();
const inCache = require('../../utils/cache/inCache');

module.exports = {
/**
 *
 * @param {Object} user
 * @param {string} password
 * @returns {string} - The token
 */
  async authentify(user, password) {
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new ApiError('Authentification failed', { statusCode: 404 });
    }
    const token = jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return token;
  },
  /**
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function
 */

  async getUser(req, res, next) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Authentification failed : no token provided' });
      }

      const user = await jwt.verify(token, process.env.JWT_SECRET);

      if (!user) {
        return res.status(401).json({ error: 'No user found' });
      }
      const cache = inCache(token, blackList);
      if (cache) {
        return res.status(401).json({ error: 'Authentification failed : token blacklisted' });
      }

      req.usere = user;

      return next();
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json(err);
      }
      logger.log(err, req.headers.authorization);
      throw new ApiError(err.message, err.infos);
    }
  },

  async logout(token) {
    try {
      const expiration = await jwt.decode(token).exp;
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = expiration - now;
      blackList.set(token, token, timeLeft);

      return true;
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

};
