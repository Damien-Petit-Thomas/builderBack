const NodeCache = require('node-cache');

module.exports = class BlackList {
  static instance = null;

  constructor() {
    this.cache = new NodeCache();
    this.TTL = 60 * 60 * 24 * 7; // 1 week
  }

  static getInstance() {
    if (!BlackList.instance) {
      BlackList.instance = new BlackList();
    }
    return BlackList.instance;
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
};
