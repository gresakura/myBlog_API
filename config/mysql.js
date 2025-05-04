const mysql = require('mysql2/promise')
const {log} = require("debug");
require("dotenv").config()

const mysqlConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // 连接池大小
    queueLimit: 0,
}

const pool = mysql.createPool(mysqlConfig)

pool.getConnection().then(conn => {
    log("mysql数据库连接成功")
    conn.release()
}).catch(err => {
    console.error('mysql数据库连接失败', err)
})

module.exports = pool