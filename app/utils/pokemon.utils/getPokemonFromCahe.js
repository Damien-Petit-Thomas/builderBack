const CachePokemon = require('../cache/pokemon.cache');

const cache = CachePokemon.getInstance();

module.exports = (id) => cache.get(id) || null;
