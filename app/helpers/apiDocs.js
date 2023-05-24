const expressJSDocSwagger = require('express-jsdoc-swagger');

const options = {
  info: {
    version: '1.0.0',
    title: 'O\'Builder',
    description: `O\'Builder API.
    L\'API pour les dresseurs de pokémon!
    le but de cette API est de permettre aux frontend de pouvoir accéder à des données sur les pokémons et les types de pokémons.
    de maniers tres simple et rapide.  l'API renvoie des données au format JSON avec le calul des dégats en fonction des types de pokémons.
    De plus l'API permet de créer des équipes de pokémons et de les sauvegarder en base de données et propose eqelement un système de completion d'équipe.`,

  },

  baseDir: __dirname,
  filesPattern: ['./*.js'],
  swaggerUIPath: process.env.API_PATH,
  exposeApiDocs: true,
  apiDocsPath: '/api-docs',

};

module.exports = (app) => expressJSDocSwagger(app)(options);
