const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  //operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.otp = require("../models/otp.model.js")(sequelize, Sequelize);
db.image = require("../models/image.model.js")(sequelize, Sequelize);
db.category = require("../models/categories.model.js")(sequelize, Sequelize);
db.banner = require("../models/banners.model.js")(sequelize, Sequelize);
db.marketplace = require("../models/marketplaces.model.js")(
  sequelize,
  Sequelize
);

// db.otp.hasOne(db.users, {
//   as: "email",
//   foreignKey: "email",
// });

db.role.belongsToMany(db.users, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "email",
});

db.users.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "email",
  otherKey: "roleId",
});

db.users.hasMany(db.marketplace);
db.image.hasMany(db.marketplace);

db.marketplace.belongsTo(db.users, {
  foreignKey: "email",
  //as: "owner",
  targetKey: "email",
});

db.marketplace.belongsTo(db.users, {
  foreignKey: "buyer",
  //as: "a_buyer",
  targetKey: "email",
});

db.marketplace.belongsTo(db.image, {
  foreignKey: "product",
  targetKey: "id",
});

db.ROLES = ["user", "admin"];

module.exports = db;
