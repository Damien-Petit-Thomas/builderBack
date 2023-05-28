const expressJSDocSwagger = require('express-jsdoc-swagger');

const options = {
  info: {
    version: '1.0.0',
    title: 'O\'Builder',
    description: `O\'Builder API.
    L\'API pour les dresseurs de pokémon!
    Pour chaque pokémon l'API permet de récupérer les informations de bases ainsi que les relations de dégats , le tout presenté de maniere claire et lisible.
    De plus l'API permet de créer des équipes de pokémons et de les sauvegarder en base de données et propose egelement un système de completion d'équipe.`,

  },

  baseDir: __dirname,
  filesPattern: ['./*.js', '../models/*.js'],
  swaggerUIPath: process.env.API_PATH,
  exposeApiDocs: true,
  apiDocsPath: '/api-docs',

};

module.exports = (app) => expressJSDocSwagger(app)(options);
