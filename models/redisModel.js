// models/redisModel.js

const redisClient = require('../config/redis');

class RedisModel {
    // 设置键值对
    async set(key, value, expiration = null) {
        if (expiration) {
            await redisClient.set(key, value, 'EX', expiration);
        } else {
            await redisClient.set(key, value);
        }
    }

    // 获取键对应的值
    async get(key) {
        return await redisClient.get(key);
    }

    // 删除键
    async del(key) {
        return await redisClient.del(key);
    }

    // 清理特定模式的键（例如，以 'temp:' 开头的键）
    async cleanup(pattern) {
        const keys = await redisClient.keys(pattern);
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`清理了 ${keys.length} 个匹配 ${pattern} 的键`);
        } else {
            console.log(`没有找到匹配 ${pattern} 的键`);
        }
    }
}

module.exports = RedisModel;