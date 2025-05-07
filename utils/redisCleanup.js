// tasks/redisCleanup.js

const cron = require('node-cron');
const RedisModel = require('../models/redisModel');
const redisModel = new RedisModel();

// 定义清理任务
const cleanupTask = async () => {
    try {
        // 清理以 'jwt:' 开头的键
        await redisModel.cleanup('jwt:*');
    } catch (error) {
        console.error('Redis 清理任务执行失败:', error);
    }
};

// 使用 cron 表达式设置定时任务
// 例如，每天凌晨 1 点执行清理任务
cron.schedule('0 1 * * *', cleanupTask);

console.log('Redis 清理定时任务已配置');