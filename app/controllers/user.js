const bcrypt = require('bcrypt');
const { user } = require('../models/index.datamapper');
const login = require('../services/auth.sevice/login.service');
const logger = require('../helpers/logger');
const team = require('../models/index.datamapper');
const teamHasPokemon = require('../models/index.datamapper');

module.exports = {

  register: async (req, res) => {
    const { email, password, username } = req.body;
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
        username,
      });
      logger.log('info', `User ${newUser.id} created`);
      res.redirect('/login');
    } else {
      res.status(400).json({ message: 'Email already exist' });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    const userFound = await user.findByMail(email);
    if (!userFound) {
      res.status(400).json({ message: 'Invalid email' });
    }
    userFound.ip = req.ip;
    const token = login.authentify(userFound, password);
    res.status(200).json({ token });
  },

  userPage: async (req, res) => {
    const userFound = await user.findById(req.user.id);
    if (!userFound) {
      res.status(400).json({ message: 'Invalid user' });
    }
    // on recupere les teams du user
    const teams = await team.getTeamsByUserId(req.user.id);
    res.status(200).json({ userFound, teams });
  },

  createMyTeam: async (req, res) => {
    try {
      const { name, userId } = req.body;
      const inputData = {
        name,
        user_id: userId,
      };
      const newTeam = await team.create(inputData);

      const { pokemonIds } = req.body;
      let pokeInTeam;

      if (newTeam) {
        pokeInTeam = await teamHasPokemon.insertTeam(pokemonIds, newTeam.id);
      } else {
        // Gérer le cas où la création de l'équipe a échoué
        throw new Error('Failed to create team');
      }

      res.status(200).json({ newTeam, pokeInTeam });
    } catch (error) {
      // Gérer les erreurs et renvoyer une réponse d'erreur appropriée
      res.status(500).json({ message: error.message });
    }
  },

};
