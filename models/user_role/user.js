const { DataTypes } = require('sequelize')
const sequelize = require('../../config/mysql')
const modelConfig = require('../modelConfig')

const Users = sequelize.define('sys_user', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        comment: '用户名'
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '邮箱'
    },
    account: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: '账号'
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '密码'
    },
    gender: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '性别'
    },
    imgurl: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: '头像'
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '状态'
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
        comment: '是否删除'
    }
}, { ...modelConfig })

// 导出User模型
module.exports = {
    Users,
    // AnotherModel, // 如果有其他模型，也在这里导出
    sequelize // 通常也会导出Sequelize实例，以便在应用的其他部分使用
};