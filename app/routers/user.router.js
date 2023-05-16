const express = require('express');

const { userController: controller } = require('../controllers/index');

const controllerHandler = require('../helpers/controllerHandler');
const validate = require('../validation/validator');
const createShema = require('../validation/schemas/userCreate.schema');
const loginShema = require('../validation/schemas/userLogin.schema');

const router = express.Router();

router
  .route('/signup')
  .post(validate('body', createShema), controllerHandler(controller.register));

router
  .route('/signin')
  .post(validate('body', loginShema), controllerHandler(controller.login));

// router
//   .route('/logout')
//   .post(controllerHandler(controller.logout));

// router
//   .route('/me')
//   .get(controllerHandler(controller.getMe));

// router
//   .route('/me/teams')
//   .get(controllerHandler(controller.getMyTeams));

// router
//   .route('/user/teams/:id')
//   .get(controllerHandler(controller.getMyTeamById));

// router
//   .route('/user/teams/:id')
//   .delete(controllerHandler(controller.deleteMyTeamById));

// router
//   .route('/user/teams/:id')
//   .patch(controllerHandler(controller.updateMyTeamById));

// router
//   .route('/user/teams/:id/pokemons')
//   .get(controllerHandler(controller.getMyTeamPokemons));
module.exports = router;
