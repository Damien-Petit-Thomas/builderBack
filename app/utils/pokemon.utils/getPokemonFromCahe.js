const CacheServer = require('../cache');

const cache = CacheServer.getInstance();

module.exports = (id) => cache.get(id) || null;
