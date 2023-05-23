const bcrypt = require('bcrypt');
const { user } = require('../../models/index.datamapper');
const login = require('../../services/auth.sevice/login.service');
const logger = require('../../helpers/logger');
const team = require('../../models/index.datamapper');
const teamHasPokemon = require('../../models/index.datamapper');
const { ApiError } = require('../../helpers/errorHandler');

module.exports = {

  register: async (req, res) => {
    const { email, password, username } = req.body;
    console.log(req.body);
    let validForm = true;
    if (await user.getOneByEmail(email)) {
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
      res.status(200).json({ message: 'User created' });
    } else {
      throw new ApiError('Invalid form', 400);
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
      const { teamName, usere } = req.body;
      const inputData = {
        name: teamName,
        user_id: usere.id,
      };
      const newTeam = await team.create(inputData);

      const { pokemonIds } = req.body;
      let pokeInTeam;

      if (newTeam) {
        pokeInTeam = await teamHasPokemon.insertTeam(pokemonIds, newTeam.id);
      } else {
        // Gérer le cas où la création de l'équipe a échoué
        throw new ApiError('Failed to create team', { statusCode: 500 });
      }

      res.status(200).json({ newTeam, pokeInTeam });
    } catch (error) {
      // Gérer les erreurs et renvoyer une réponse d'erreur appropriée
      throw new ApiError('Failed to create team', { statusCode: 500 });
    }
  },

};
