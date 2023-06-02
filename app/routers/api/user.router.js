const express = require('express');

const { userController: controller } = require('../../controllers/api');

const controllerHandler = require('../../helpers/controllerHandler');
const validate = require('../../validation/validator');
const createShema = require('../../validation/schemas/userCreate.schema');
const loginShema = require('../../validation/schemas/userLogin.schema');
const login = require('../../services/auth.sevice/login.service');

const router = express.Router();

router
  .route('/signup')
  .post(validate('body', createShema), controllerHandler(controller.register));

router
  .route('/login')
  .post(validate('body', loginShema), controllerHandler(controller.login));

// router
//   .route('/logout')
//   .post(controllerHandler(controller.logout));

router
  .route('/userPage')
  .get(login.getUser, controllerHandler(controller.userPage));

router
  .route('/user/team')
  .post(login.getUser, controllerHandler(controller.createTeam));

router
  .route('/user/team/:id')
  .delete(login.getUser, controllerHandler(controller.deleteTeam))
  .patch(login.getUser, controllerHandler(controller.updateTeam));

// router
//   .route('/user/teams/:id/pokemons')
//   .get(controllerHandler(controller.getMyTeamPokemons));

router.use(() => {
  throw new Error('Route not found');
});

module.exports = router;
