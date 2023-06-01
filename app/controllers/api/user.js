const bcrypt = require('bcrypt');
const debug = require('debug')('app:controllers:api:user');
const { user } = require('../../models');
const login = require('../../services/auth.sevice/login.service');
const logger = require('../../helpers/logger');
const { team } = require('../../models');
const { teamHasPokemon } = require('../../models');
const { ApiError } = require('../../helpers/errorHandler');

module.exports = {
  register: async (req, res) => {
    const { email, password, username } = req.body;

    try {
      if (await user.getOneByEmail(email)) {
        throw new ApiError('Email déjà utilisé', { statusCode: 400 });
      }

      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(password, salt);
      const newUser = await user.create({
        email,
        password: hash,
        username,
      });
      logger.log('info', `User ${newUser.id} created`);
      return res.status(201).json({ message: 'User created' });
    } catch (err) {
      logger.log('error', err);

      throw new ApiError(err.message, err.infos);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const userFound = await user.getOneByEmail(email);

      debug(userFound);
      if (!userFound) {
        throw new ApiError(`User with email ${email} not found`, { statusCode: 404 });
      }
      userFound.ip = req.ip;

      debug(req.ip);
      const token = await login.authentify(userFound, password);
      const userName = userFound.username;
      return res.status(200).json({ token, userName });
    } catch (err) {
      debug('error', err);
      throw new ApiError(err.message, err.infos);
    }
  },

  userPage: async (req, res) => {
    try {
      const userFound = await user.findById(req.user.id);
      if (!userFound) {
        throw new ApiError(`User with id ${req.user.id} not found`, { statusCode: 404 });
      }

      const teams = await team.getTeamsByUserId(req.user.id);
      if (!teams) {
        throw new ApiError(`error while getting teams for user with id ${req.user.id}`, { statusCode: 404 });
      }
      res.status(200).json({ userFound, teams });
    } catch (err) {
      logger.log('error', err);
      throw new ApiError(err.message, err.infos);
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

      if (newTeam && Object.keys(newTeam).length > 0) {
        pokeInTeam = await teamHasPokemon.insertTeam(pokemonIds, newTeam.id);
        if (!pokeInTeam || pokeInTeam.length === 0) {
          throw new ApiError('Failed to insert pokemon in team', { statusCode: 500 });
        }

        res.status(200).json({ newTeam, pokeInTeam });
      } else {
        throw new ApiError('Failed to create team', { statusCode: 500 });
      }
    } catch (error) {
      logger.log('error', error);
      throw new ApiError(error.message, error.infos);
    }
  },

};
