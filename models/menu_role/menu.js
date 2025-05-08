const { DataTypes } = require('sequelize')
const sequelize = require('../../config/mysql')
const modelConfig = require('../modelConfig')

const menu = sequelize.define('sys_menu', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '唯一的ID'
    },
    title: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '菜单标题'
    },
    path: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '地址',
    },
    component: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '组件路径'
    },
    antd_icon: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'antd图标'
    },
    element_icon: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'element图标'
    },
    element_push_icon: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'element-push图标'
    },
    redirect: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '是否重定向'
    },
    affix: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '是否是固定页签(0否 1是)'
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '父级ID'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '同路由中的name，主要是用于保活的左右'
    },
    hide_in_menu: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '是否隐藏在菜单中(0否 1是)'
    },
    url: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '如果当前是iframe的模式，需要有一个跳转的url支撑，其不能和path重复，path还是为路由'
    },
    hide_in_breadcrumb: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '是否隐藏在面包屑中(0否 1是)'
    },
    hide_children_in_menu: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '是否不需要显示所有的子菜单(0否 1是)'
    },
    keep_alive: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '是否保活(0否 1是)'
    },
    target: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '全连接跳转模式(\'_blank\' | \'_self\' | \'_parent\')'
    },
    is_disable: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '是否禁用(0否 1是)'
    },
    order_num: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '排序'
    },
    create_time: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: true,
        comment: '创建时间'
    },
    update_time: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: true,
        comment: '更新时间'
    },
    is_deleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
        comment: '是否删除(0否 1是)'
    }
}, { ...modelConfig })

module.exports = {
    menu,
    sequelize
};