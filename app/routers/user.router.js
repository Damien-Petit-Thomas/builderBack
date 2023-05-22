const express = require('express');

const { userController: controller } = require('../controllers/index');

const controllerHandler = require('../helpers/controllerHandler');
const validate = require('../validation/validator');
const createShema = require('../validation/schemas/userCreate.schema');
const loginShema = require('../validation/schemas/userLogin.schema');
const login = require('../services/auth.sevice/login.service');

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
  .route('/user/teams')
  .post(login.getUser, controllerHandler(controller.createMyTeam));

router
  .route('/user/teams/:id')
  .delete(login.getUser, controllerHandler(controller.deleteMyTeamById));

router
  .route('/user/teams/:id')
  .patch(login.getUser, controllerHandler(controller.updateMyTeamById));

// router
//   .route('/user/teams/:id/pokemons')
//   .get(controllerHandler(controller.getMyTeamPokemons));
module.exports = router;
