const Redis = require("ioredis");

const { db } = require('./env')

console.log(db.host, db.port, db.redis_password, db.DB)

// 创建 Redis 客户端实例
const redisClient = new Redis({
    host: db.host,
    port: db.port,

});


// 测试 Redis 连接
redisClient.on("connect", () => {
    console.log("✅ Redis 连接成功");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis 连接失败:", err.message, err);
});

module.exports = redisClient;