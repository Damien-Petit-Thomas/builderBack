const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const e = require('express');
const { ApiError } = require('../../helpers/errorHandler');

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
      throw new ApiError('Authentification failed', { statusCode: 401 });
    }
    const token = jwt.sign({
      id: user.id,
      username: user.username,
      email: user.email,
      ip: user.ip,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
  },
  /**
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next function
 */

  async getUser(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new ApiError('Authentification failed : no token provided', { statusCode: 401 });
    }
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      if (!user || user.ip !== req.ip) {
        throw new ApiError('Authentification failed', { statusCode: 401 });
      }
      req.usere = user;
      next();
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

};
