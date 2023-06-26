const Redis = require('ioredis');

class RedisCache {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async get(key) {
    const value = await this.redis.get(key);
    return JSON.parse(value);
  }

  async set(key, value, ttl) {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async del(key) {
    await this.redis.del(key);
  }

  async flush() {
    await this.redis.flushall();
  }
}

module.exports = new RedisCache();
