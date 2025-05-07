let express = require('express')
let router = express.Router()
let bcrypt = require('bcryptjs') // 用于密码加密
const redisClient = require('../config/redis');
let { generateToken } = require('../utils/jwtUtils'); // 引入JWT生成函数
let { Users } = require('../models/user_role/user')
let { sendSuccessResponse, sendErrorResponse } = require('../utils/inresponseto')
let { Op } = require('sequelize');


/**
 * @description 获取用户列表
 */
router.get('/getUsersList', async function(req, res, next) {
  try {

    let { name, email, status, create_time, update_time, gender  } = req.query

    // 解析分页参数
    let page = parseInt(req.query.pageNum) || 1 // 默认第一页
    let limit = parseInt(req.query.pageSize) || 10 // 默认每页10条
    let offset = (page - 1) * limit // 计算偏移量

    // 构建查询条件
    let where = {};
    if (name) where.name = { [Op.like]: `%${name}%` }; // 模糊查询姓名
    if (email) where.email = email; // 精确查询邮箱
    if (status) where.status = status; // 精确查询状态
    if (gender) where.gender = gender; // 精确查询性别

    // 查询所有用户
    let users = await Users.findAll({
      attributes: {
        exclude: ['password'],
      },
      where: where,
      offset: offset,
      limit: limit
    })
    sendSuccessResponse(res, 200, users, '查询成功')
  } catch (error) {
    sendErrorResponse(res, 500, '查询用户列表时发生错误')
    next(error);
  }
})

/**
 * @description 创建用户
 */
router.post('/register', async function(req, res, next) {
  try {
    let { account, password } = req.body
    // 简单的数据验证（实际应用中应更严格）
    if (!account || !password) {
      return sendErrorResponse(res, 400, '缺少必要参数')
    }

    // 检查账户是否已存在（避免重复注册）
    const accountUser = await Users.findOne({ where: { account } })
    if (accountUser) {
      return sendErrorResponse(res, 400, '账户已存在')
    }


    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户记录
    const newUser = await Users.create({
      account,
      password: hashedPassword,
      // 可以根据需要添加其他字段，如状态、性别等
    });
// 发送成功响应（通常不包含敏感信息，如密码）
    sendSuccessResponse(res, 200, null, '用户注册成功');
  } catch (error) {
    console.log(error)
    sendErrorResponse(res, 500, '创建用户时发生错误')
    next(error);
  }
})

/**
 * @description 登录
 */
router.post('/login', async function(req, res, next) {
  try {
    let { account, password } = req.body
    // 简单的数据验证（实际应用中应更严格）
    if (!account || !password) {
      return sendErrorResponse(res, 400, '缺少必要参数')
    }

    // 查询用户
    const user = await Users.findOne({ where: { account } })
    if (!user) {
      return sendErrorResponse(res, 400, '用户不存在')
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return sendErrorResponse(res, 400, '密码错误')
    }


    // 用户登录成功，生成JWT token
    const accessToken = generateToken({ id: user.id, account: user.account }, { expiresIn: '31d' })
    // const refreshToken = generateToken({ id: user.id, account: user.account }, { expiresIn: '31d' })

    // 计算31天的秒数
    const expiresInSeconds = 31 * 24 * 60 * 60;
    console.log('user', user)
    // 构建响应数据，不包括敏感信息（如密码）
    const userInfo = {
      userInfo: {
        id: user.id,
        account: user.account,
        name: user.name,
        email: user.email,
        gender: user.gender,
        imgurl: user.imgurl,
        status: user.status,
        create_time: user.create_time,
        update_time: user.update_time,
        is_deleted: user.is_deleted,
      },
      token: {
        access_token: accessToken,
        token_type: "Bearer",
        expires_in: expiresInSeconds,
        // refresh_token: refreshToken
      }
      // 其他非敏感信息...
    };
    sendSuccessResponse(res, 200, userInfo, '登录成功')


  } catch (error) {
    sendErrorResponse(res, 500, '登录时发生错误')
    next(error)
  }
})

/**
 * @description 退出登入
 */
router.post('/logout', async function(req, res, next) {
  try {
    // const { userId } = req.body
    const authHeader = req.headers.authorization.split(' ')
    console.log(authHeader)

    if (!authHeader) {
      sendErrorResponse(res, 500, '缺少或无效的Authorization头')
    }

    // 将令牌加入Redis黑名单（假设使用一个set来存储黑名单令牌）
    await redisClient.sadd('jwt:blacklist', authHeader);

    // 清除用户的登录状态或令牌（实际应用中可能需要实现）
    sendSuccessResponse(res, 200, null, '退出成功')
  } catch (error) {
    sendErrorResponse(res, 500, '退出时发生错误')
    next(error)
  }
})

/**
 * @description 修改密码
 */
router.post('/update-password', async function(req, res, next) {
  try {
    let { userId, newPassword } = req.body;

    // 验证参数是否存在
    if (!userId || !newPassword) {
      return sendErrorResponse(res, 400, '缺少必要参数');
    }

    // 根据用户ID查找用户
    const user = await Users.findOne({ where: { id: userId } });
    if (!user) {
      return sendErrorResponse(res, 404, '用户不存在');
    }

    // 将新密码进行加密
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 更新用户密码
    await user.update({ password: hashedNewPassword });

    // 发送成功响应
    sendSuccessResponse(res, 200, null, '密码修改成功');
  } catch (error) {
    sendErrorResponse(res, 500, '修改密码时发生错误');
    next(error);
  }
})

/**
 * @description 修改用户信息
 */
router.put(`/update-user-info/:id`, async function(req, res, next) {
  try {
    const userId = req.params.id

    const { name, email, gender, imgurl, status, is_deleted } = req.body

    const updatedInfo = {
      name,
      email,
      gender,
      imgurl,
      status,
      is_deleted
    }

    // 验证用户ID和更新信息是否存在
    if (!userId || !updatedInfo) {
      return sendErrorResponse(res, 400, '缺少必要参数')
    }

    // 根据用户ID查找用户
    const user = await Users.findOne({ where: { id: userId } })
    if (!user) {
      return sendErrorResponse(res, 404, '用户不存在')
    }

    // 更新用户信息
    await user.update(updatedInfo)

    // 发送成功响应
    sendSuccessResponse(res, 200, null, '用户信息更新成功');
  } catch (error) {
    sendErrorResponse(res, 500, '更新用户信息时发生错误');
    next(error)
  }
})

/**
 * @description 查找用户信息
 */
router.get(`/user-info`, async function(req, res, next) {
  try {
    let userId = req.query.id
    console.log(userId)

    const userInfo = await Users.findOne({
      attributes: {
        exclude: ['password'],
      },
      where: { id: userId }
    })

    if (!userInfo) {
      sendErrorResponse(res, 404, '用户不存在')
    }

    sendSuccessResponse(res, 200, userInfo, '用户信息获取成功');

  } catch (error) {
    sendErrorResponse(res, 500, '获取用户信息失败');
    next(error);
  }
})

/**
 * @description 删除用户信息
 */
router.delete(`/delete-userInfo`, async function(req, res, next) {
  try {
    // 从查询字符串中获取用户ID列表
    let ids = req.query.id
    if (!ids) {
      return sendErrorResponse(res, 400, '缺少必要参数: id')
    }

    // 将ID字符串转换为数组（如果是单个ID，则数组只包含一个元素）
    ids = ids.split(',').map(id => id.trim())

    // 验证ID数组中的每个元素是否为数字
    for (let id of ids) {
      if (isNaN(id)) {
        return sendErrorResponse(res, 400, 'ID列表中包含非数字值');
      }
    }

    // 执行删除操作（假设Users模型有一个destroy方法）
    await Users.destroy({
      where: {
        id: ids // Sequelize会自动处理数组，使用IN查询
      }
    })

    // 发送成功响应（可以包含被删除的用户ID列表，但通常出于安全考虑不返回具体信息）
    sendSuccessResponse(res, 200, null, '用户信息删除成功')

  } catch (error) {
    sendErrorResponse(res, 500, '删除用户信息时发生错误')
    next(error)
  }
})


module.exports = router;
