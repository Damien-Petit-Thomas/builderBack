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
    try {
      if (await user.getOneByEmail(email)) {
        return res.status(400).json({ message: 'Email already exist' });
      }

      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(password, salt);
      const newUser = await user.create({
        email,
        password: hash,
        username,
      });
      logger.log('info', `User ${newUser.id} created`);
<<<<<<< HEAD
      return res.status(200).json({ message: 'User created' });
=======
      return res.status(201).json({ message: 'User created' });
>>>>>>> main
    } catch (err) {
      logger.log('error', err);
      return res.status(400).json({ message: 'Invalid form' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const userFound = await user.findByMail(email);
      if (!userFound) {
        return res.status(400).json({ message: 'Invalid email' });
      }
      userFound.ip = req.ip;
      const token = login.authentify(userFound, password);
      return res.status(200).json({ token });
    } catch (err) {
      logger.log('error', err);
      return res.status(400).json({ message: 'Invalid form' });
    }
  },

  userPage: async (req, res) => {
    try {
      const userFound = await user.findById(req.user.id);
      if (!userFound) {
        res.status(400).json({ message: 'Invalid user' });
      }

      const teams = await team.getTeamsByUserId(req.user.id);
      res.status(200).json({ userFound, teams });
    } catch (err) {
      logger.log('error', err);
      return res.status(400).json({ message: 'Invalid form' });
    }
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
        throw new ApiError('Failed to create team', { statusCode: 500 });
      }

      res.status(200).json({ newTeam, pokeInTeam });
    } catch (error) {
      throw new ApiError('Failed to create team', { statusCode: 500 });
    }
  },

};
