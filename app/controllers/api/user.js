/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const sanitizeHtml = require('sanitize-html');
const { cacheOrFormatPokemon: getPokemon } = require('../../utils/pokemon.utils/cacheOrFormatPokemon');
const login = require('../../services/auth.sevice/login.service');
const logger = require('../../helpers/logger');
const {
  team, teamHasPokemon, user, userHasFavo,
} = require('../../models');

const { ApiError } = require('../../helpers/errorHandler');

const pokeCache = require('../../utils/cache/pokemon.cache').getInstance();

module.exports = {
  async register(req, res) {
    const email = sanitizeHtml(req.body.email);
    const password = sanitizeHtml(req.body.password);
    const username = sanitizeHtml(req.body.username);

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

  async login(req, res) {
    try {
      const email = sanitizeHtml(req.body.email);
      const password = sanitizeHtml(req.body.password);
      const userFound = await user.getOneByEmail(email);

      if (!userFound) {
        throw new ApiError(`User with email ${email} not found`, { statusCode: 404 });
      }

      const token = await login.authentify(userFound, password);
      const userName = userFound.username;

      return res.status(200).json({ token, userName });
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async logout(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const result = await login.logout(token);
      if (!result) {
        throw new ApiError('Logout failed', { statusCode: 500 });
      }
      return res.status(200).json({ message: 'User logged out' });
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async userPage(req, res) {
    try {
      const userFound = await user.findByPk(req.usere.id);
      delete userFound.password;
      if (!userFound) {
        throw new ApiError(`User with id ${req.usere.id} not found`, { statusCode: 404 });
      }

      const teams = await team.getTeamsByUserId(req.usere.id);

      if (!teams || teams.length === 0) {
        throw new ApiError(`No teams found for user with id ${req.usere.id}`, { statusCode: 404 });
      }

      const teamPromises = teams.map(async (pokeTeam) => {
        const pokemonPromises = pokeTeam.pokemon_id.map(async (id) => {
          const result = await getPokemon(id, pokeCache);
          return result;
        });

        const pokemonData = await Promise.all(pokemonPromises);

        return { ...pokeTeam, pokemon: pokemonData };
      });

      const teamsData = await Promise.all(teamPromises);

      const userFavorites = await userHasFavo.getFavoritesByUserId(req.usere.id);

      const favoritesPromises = userFavorites.map(async (favorite) => {
        const result = await getPokemon(favorite.favorite_id, pokeCache);
        return result;
      });

      const favoritesData = await Promise.all(favoritesPromises);

      return res.status(200).json({ user: userFound, teams: teamsData, favorites: favoritesData });
    } catch (err) {
      logger.log('error', err);
      throw new ApiError(err.message, err.infos);
    }
  },

  async createTeam(req, res) {
    try {
      const { teamName } = req.body;
      const { usere } = req;

      const inputData = {
        name: teamName,
        user_id: usere.id,
      };
      const teamFound = await team.getOneByName(teamName, usere.id);
      if (teamFound) throw new ApiError(`Team with name ${teamName} already exists`, { statusCode: 400 });
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

  async deleteTeam(req, res) {
    const { id } = req.body;
    const teamFound = await team.findByPk(id);
    if (!teamFound || teamFound.user_id !== req.usere.id) {
      throw new ApiError(`Team with id ${id} not found`, { statusCode: 404 });
    }
    try {
      const response = team.delete(id);
      if (!response) throw new ApiError('Failed to delete team', { statusCode: 500 });
      res.status(200).json({ response, message: `Team ${id} deleted` });
    } catch (err) {
      throw new ApiError(err.messagen, err.infos);
    }
  },

  //   updateTeam: async (req, res) => {
  // const { user.id } = req.body;
  //   },
  async addPokemonInFavorite(req, res) {
    try {
      const userId = req.usere.id;
      const favoriteId = req.params.id;
      const isInDb = await userHasFavo.findOne(userId, favoriteId);
      if (isInDb) throw new ApiError(`Pokemon ${favoriteId} already in favorite`, { statusCode: 401 });
      const result = await userHasFavo.create({ user_id: userId, favorite_id: favoriteId });
      if (!result) throw new ApiError('a probleme occured', { statusCode: 500 });
      res.status(201).json(`Pokemon ${favoriteId} add to favorite`);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async deletePokemonFromFavorite(req, res) {
    try {
      const userId = req.usere.id;
      const favoriteId = req.params.id;
      const isInDb = await userHasFavo.findOne(userId, favoriteId);
      if (!isInDb) throw new ApiError(`Pokemon ${favoriteId} not in favorite`, { statusCode: 401 });
      const result = await userHasFavo.deleteOne(userId, favoriteId);
      if (!result) throw new ApiError('a probleme occured', { statusCode: 401 });
      res.status(201).json(`Pokemon ${favoriteId} delete from favorite`);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },

  async getUserFavorites(req, res) {
    try {
      const userId = req.usere.id;
      const userFavorites = await userHasFavo.getFavoritesByUserId(userId);
      const favorites = userFavorites.map(({ favorite_id }) => favorite_id);

      return res.status(200).json(favorites);
    } catch (err) {
      throw new ApiError(err.message, err.infos);
    }
  },
};
