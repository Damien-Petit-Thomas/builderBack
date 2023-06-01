//* This tool serves the purpose of offering a unified cache throughout the API,
//* adhering to the singleton design pattern.

const NodeCache = require('node-cache');

class CacheType {
  static instance = null;

  constructor() {
    this.cache = new NodeCache();
    this.TTL = 60 * 60 * 24 * 7; // 1 week
  }

  static getInstance() {
    if (!CacheType.instance) {
      CacheType.instance = new CacheType();
    }
    return CacheType.instance;
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

module.exports = CacheType;
