const sanitizeHtml = require('sanitize-html');
const { ApiError } = require('../../helpers/errorHandler');
const { admi } = require('../../models');
const login = require('../../services/auth.sevice/login.service');

module.exports = {

  async login(req, res) {
    const email = sanitizeHtml(req.body.email);
    const password = sanitizeHtml(req.body.password);
    const userFound = await admi.getOneByEmail(email);
    console.log(email, password, userFound);
    if (!userFound) {
      throw new ApiError(`User with email ${email} not found`, { statusCode: 404 });
    }

    const token = await login.authentify(userFound, password);
    const userName = userFound.username;

    return res.status(200).json({ token, userName });
  },

};
