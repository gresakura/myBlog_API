// config/menu.js
const envConfig = require('./env');
const middleware = require('./middleware')
const mysql = require('./mysql')
const redis = require('./redis')

module.exports = {
    ...envConfig,  // 环境变量配置
    mysql,             // 数据库配置
    redis           // Redis 配置（可选）
}