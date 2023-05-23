// require('dotenv').config();

// const logger = require('../helpers/logger');
// const { poke } = require('../models/index.datamapper');
// const { team } = require('../models/index.datamapper');
// const pokemon = require('./pokemon');

// module.exports = {

//   async getTeamCompletion(req, res) {
//     console.log(req.body);
//     // le req.body contient un tableau avec les ids des pokemons
//     const poketeam = req.body;
//     // on vérifie que le tableau contient entre 1 et 5 pokemons
//     if (poketeam.length < 1 || poketeam.length > 5) {
//       return res.status(400).json({
//         error: 'Bad request',
//         message: 'The req body must contain between 1 and 5 pokemons',
//       });
//     }
//     console.log(new Set(poketeam).size);
//     console.log(poketeam.length);
//     // on verifie que les pokemons sont tous différents
//     if (new Set(poketeam).size !== poketeam.length) {
//       return res.status(400).json({
//         error: 'Bad request',
//         message: 'The req body must contain different pokemons',
//       });
//     }
//     // on recupere les pokemons depuis la base de données
//     const promises = poketeam.map(async (id) => {
//       const pokeInTeam = await getOne(id);
//       if (!pokeInTeam) {
//         return res.status(400).json({
//           error: 'Bad request',
//           message: `Pokemon with id ${id} not found`,
//         });
//       }
//       return pokeInTeam;
//     });
//     const teamPokemons = await Promise.all(promises);
//     console.log(teamPokemons);
//     return res.json(teamPokemons);
//     // const suggestedTeam = await team.getSuggestedTeam(...pokemons);
//     // return res.json(suggestedTeam);
//   },
// };
