// config/env.js
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const development = {
    app: {
        port: parseInt(process.env.DEV_APP_PORT),
        secretKey: process.env.DEV_SECRET_KEY
    },
    db: {
        host: process.env.DEV_DB_HOST,
        user: process.env.DEV_DB_USER,
        password: process.env.DEV_DB_PASSWORD,
        database: process.env.DEV_DB_NAME,
        port: parseInt(process.env.DEV_REDIS_PORT),
        DB: parseInt(process.env.DEV_REDIS_DB),
        redis_password: process.env.DEV_REDIS_DB_PASSWORD
    }
};

const production = {
    app: {
        port: parseInt(process.env.PROD_APP_PORT) || 80,
        secretKey: process.env.PROD_SECRET_KEY
    },
    db: {
        host: process.env.PROD_DB_HOST,
        user: process.env.PROD_DB_USER,
        password: process.env.PROD_DB_PASSWORD,
        database: process.env.PROD_DB_NAME,
        port: process.env.DEV_REDIS_PORT,
        DB: process.env.PROD_REDIS_DB,
        redis_password: process.env.PROD_REDIS_DB_PASSWORD
    }
};

const config = { development, production };

module.exports = config[env];