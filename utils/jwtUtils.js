const jwt = require('jsonwebtoken');
const {sendErrorResponse} = require("./inresponseto");
const JWT_SECRET = 'sakura_secret_key_here'; // 请替换为您的实际秘钥

/**
 * 生成JWT token
 * @param {Object} payload - token的载荷，包含用户信息等
 * @param {Object} options - token的选项，比如过期时间
 * @returns {string} 生成的token
 */
function generateToken(payload, options = { expiresIn: '1h' }) {
    return jwt.sign(payload, JWT_SECRET, options)
}

/**
 * 验证JWT token
 * @param {string} token - 需要验证的token
 * @returns {Object|null} 验证成功返回解码后的payload，失败返回null
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        throw new Error('令牌无效')
    }
}

module.exports = {
    generateToken,
    verifyToken
};