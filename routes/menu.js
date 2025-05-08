let express = require('express')
let router = express.Router()

let { menu } = require('../models/menu_role/menu')
let { sendSuccessResponse, sendErrorResponse } = require('../utils/inresponseto')
let { Op } = require('sequelize')

/**
 * @description 获取菜单列表
 */
router.get('/menuList', async function(req, res, next) {
  try {
    let { title, is_disable } = req.query

    // 构建查询条件
    let where = {}
    if (title) where.title = { [Op.like]: `%${title}%` }
    if (is_disable) where.is_disable = is_disable

    let menuList = await menu.findAll({
      where: where
    })

    sendSuccessResponse(res, 200, menuList, '菜单列表获取成功')

  } catch (error) {
    sendErrorResponse(res, 500, '获取菜单列表失败')
    next(error)
  }
})

/**
 * @description 添加菜单
 */
router.post('/getAddMenu', async function(req, res, next) {
  try {
    let {
      parent_id,
      title,
      component,
      order_num,
      path,
      antd_icon,
      element_icon,
      element_push_icon,
      redirect,
      affix,
      name,
      hide_in_menu,
      url,
      hide_in_breadcrumb,
      hide_children_in_menu,
      keep_alive,
      target,
      is_disable,
      is_deleted
    } = req.body

    if (!title || !component || !path) {
      return sendErrorResponse(res, 400, '缺少 title、component、path 必要参数')
    }

    // 检查是否存在具有相同标题的菜单
    const existingMenu = await menu.findOne({ where: { title } });
    if (existingMenu) {
      return sendErrorResponse(res, 400, '菜单标题已存在，请使用其他标题');
    }

    // 创建新菜单对象
    const newMenu = {
      parent_id,
      title,
      component,
      order_num,
      path,
      antd_icon,
      element_icon,
      element_push_icon,
      redirect,
      affix,
      name,
      hide_in_menu,
      url,
      hide_in_breadcrumb,
      hide_children_in_menu,
      keep_alive,
      target,
      is_disable,
      is_deleted
    }

    // 保存到数据库
    const createdMenu = await menu.create(newMenu)

    // 发送成功响应
    sendSuccessResponse(res, 200, createdMenu, '菜单添加成功')
  } catch (error) {
    sendErrorResponse(res, 500, '添加菜单失败')
    next(error)
  }
})

/**
 * @description 删除菜单
 */
router.delete('/menu/:id', async function(req, res, next) {
  try {
    let menuId = req.params.id
    // 检查菜单是否存在
    const existingMenu = await menu.findByPk(menuId);
    if (!existingMenu) {
      return sendErrorResponse(res, 404, '菜单不存在');
    }

    // 递归删除所有子菜单
    async function deleteSubMenus(parentId) {
      const subMenus = await menu.findAll({ where: { parent_id: parentId } })
      for (const subMenu of subMenus) {
        await deleteSubMenus(subMenu.id) // 递归删除子菜单的子菜单
        await subMenu.destroy() // 删除当前子菜单
      }
    }

    // 删除当前菜单的所有子菜单
    await deleteSubMenus(menuId)

    // 删除当前菜单
    await existingMenu.destroy()


    // 设置 is_deleted 为 true 来软删除菜单
    // await menu.destroy({  where: { id: menuId } });

    sendSuccessResponse(res, 200, null, '菜单已成功删除')
  } catch (error) {
    sendErrorResponse(res, 500, '删除菜单失败')
    next(error)
  }
})

module.exports = router;
