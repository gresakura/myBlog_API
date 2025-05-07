// config/middleware.js
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');

/*
module.exports = (app) => {
    // 安全头设置
    app.use(helmet());

    // 跨域配置
    app.use(cors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }));

    // 请求日志
    if (process.env.NODE_ENV !== 'production') {
        app.use(morgan('dev'));
    }

    // 解析请求体
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
};*/
