const bcrypt = require('bcrypt');
const { user } = require('../models/index.datamapper');
const { authentify } = require('../services/auth.sevice/login.service');

module.exports = {

  register: async (req, res) => {
    const { email, password, usename } = req.body;
    let validForm = true;
    if (await user.findByMail(email)) {
      validForm = false;
    }
    if (validForm) {
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(password, salt);
      const newUser = await user.create({
        email,
        password: hash,
        usename,
      });
      res.status(201).json(newUser);
    } else {
      res.status(400).json({ message: 'Email already exist' });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    const userFound = await user.findByMail(email);
    if (userFound) {
      const validPassword = await bcrypt.compareSync(password, userFound.password);
      if (validPassword) {
        const token = authentify(userFound, req.ip);
        res.status(200).json({ token });
      } else {
        res.status(400).json({ message: 'Invalid password' });
      }
    } else {
      res.status(400).json({ message: 'Invalid email' });
    }
  },

};
