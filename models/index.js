const sequelize = require('../config/mysql');

const { Users } = require('./user_role/user')



module.exports = {
    Users,
    sequelize // 导出Sequelize实例，以便在应用的其他部分使用
};