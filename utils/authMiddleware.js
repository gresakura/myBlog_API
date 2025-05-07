// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken')
const redisClient = require('../config/redis')
const { sendErrorResponse } = require('../utils/inresponseto')
const { verifyToken } = require('../utils/jwtUtils')


// 需要token的路由路径数组（可以根据实际需求调整）
const routesRequireToken = [
    '/logout', // 假设退出登录需要token
    // 可以添加其他需要token的路由路径
    '/getUsersList',
    '/update-password',
    '/update-user-info',
];

// JWT验证中间件
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const routePath = req.path;

    // 检查当前路由是否需要token
    if (routesRequireToken.includes(routePath)) {
        if (!authHeader) {
            return sendErrorResponse(res, 401, '未提供令牌或令牌格式不正确');
        }

        try {

            // 尝试验证令牌
            const payload = verifyToken(authHeader);
            console.log('Token 验证成功', payload);
            redisClient.sismember('jwt:blacklist', authHeader, (err, isMember) => {
                if (err) {
                    return sendErrorResponse(res, 500, 'Redis 服务器错误')
                }

                if (isMember) {
                    return sendErrorResponse(res, 401, '令牌无效或已过期')
                }

                next(); // 继续处理请求
            })
        } catch (err) {
            return sendErrorResponse(res, 401, '令牌无效或已过期');
        }

    } else {
        next(); // 路由不需要token，直接继续处理请求
    }
}

module.exports = authMiddleware;