const Redis = require("ioredis");
require("dotenv").config();

// 创建 Redis 客户端实例
const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD, // 如果无密码可省略
    db: process.env.REDIS_DB, // 默认数据库索引
});

// 测试 Redis 连接
redisClient.on("connect", () => {
    console.log("✅ Redis 连接成功");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis 连接失败:", err.message);
});

module.exports = redisClient;