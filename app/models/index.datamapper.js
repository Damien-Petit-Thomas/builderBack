const client = require('../config/db');

const Pokemon = require('./pokemon.datamapper');
const Type = require('./type.datamapper');
const Team = require('./team.datamapper');
const Gen = require('./gen.datamapper');
const User = require('./user.datamapper');

module.exports = {
  user: new User(client),
  type: new Type(client),
  poke: new Pokemon(client),
  team: new Team(client),
  gen: new Gen(client),

};
