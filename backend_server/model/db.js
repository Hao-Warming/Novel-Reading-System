const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("reading_system", "数据库账号名", "数据库密码", {
    host: "localhost",
    dialect: "mysql",
    // logging: null //不要输出过多的日志
    pool: {
        max: 15,
        min: 5,
        idle: 20000,
        evict: 15000,
        acquire: 30000
    },
});

module.exports = sequelize;