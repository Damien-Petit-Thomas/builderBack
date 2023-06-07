const client = require('../config/db');

const Ability = require('./ability.datamapper');
const Pokemon = require('./pokemon.datamapper');
const Type = require('./type.datamapper');
const Team = require('./team.datamapper');
const Gen = require('./gen.datamapper');
const User = require('./user.datamapper');
const TeamHasPokemon = require('./teamHasPokemon.datamapper');
const PokemonHasAbility = require('./pokemonHasAbility.datamapper');

module.exports = {
  pokeHasAbi: new PokemonHasAbility(client),
  ability: new Ability(client),
  teamHasPokemon: new TeamHasPokemon(client),
  user: new User(client),
  type: new Type(client),
  poke: new Pokemon(client),
  team: new Team(client),
  gen: new Gen(client),

};
