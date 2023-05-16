const NodeCache = require('node-cache');

class CacheServer {
  static instance = null;

  constructor() {
    this.cache = new NodeCache();
    this.TTL = 180; // 3 minutes
  }

  static getInstance() {
    if (!CacheServer.instance) {
      CacheServer.instance = new CacheServer();
    }
    return CacheServer.instance;
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value, ttl) {
    return this.cache.set(key, value, ttl);
  }

  del(key) {
    return this.cache.del(key);
  }

  flush() {
    return this.cache.flushAll();
  }
}

module.exports = CacheServer;
