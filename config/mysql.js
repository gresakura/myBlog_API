const mysql = require('mysql2/promise')
const Sequelize = require('sequelize')
const { db } = require('./env')

const mysqlConfig = {
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database,
    waitForConnections: true,
    connectionLimit: 10, // 连接池大小
    queueLimit: 0,
}

const sequelize = new Sequelize(mysqlConfig.database, mysqlConfig.user, mysqlConfig.password, {
    host: mysqlConfig.host,
    dialect: 'mysql',
    pool: {
        max: 5, // 连接池中最大连接数量
        min: 0, // 连接池中最少连接数量
        acquire: 30000, // 一个连接的等待时间，如果超过此时间限制，则报错。ms
        idle: 10000, // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
    },
})

sequelize.authenticate()
    .then(() => console.log('✅ 数据库连接成功'))
    .catch(err => console.error('❌ 数据库连接失败:', err));

module.exports = sequelize