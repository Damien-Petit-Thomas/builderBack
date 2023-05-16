const express = require('express');

const pokeRouter = require('./pokemon.router');
const pokeSeedRouter = require('./pokemon.seeding.router');
const typeRouter = require('./type.router');
const teamRouter = require('./team.router');
const cacheRouter = require('./cache.router');
const userRouter = require('./user.router');
const generationRouter = require('./generation.router');
const { apiController } = require('../controllers');

const router = express.Router();

router.get('/', apiController.home);

router.use('/pokemon', pokeRouter);
router.use('/type', typeRouter);
router.use('/gen', generationRouter);
router.use('/seeding', pokeSeedRouter);
router.use('/team', teamRouter);
router.use('/cache', cacheRouter);
router.use('/user', userRouter);
module.exports = router;
