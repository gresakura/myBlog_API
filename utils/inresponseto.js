// 辅助函数：发送成功响应
function sendSuccessResponse(res, code, data, message) {
    return res.status(code).json({
        status: 'success',
        code,
        message,
        data
    });
}

function sendErrorResponse(res, code, message) {
    return res.status(code).json({
        status: 'error',
        code,
        message,
    });
}

module.exports = {
    sendSuccessResponse,
    sendErrorResponse
}