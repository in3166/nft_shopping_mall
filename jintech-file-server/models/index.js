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
db.marketHistory = require("./marketHistories.model.js")(sequelize, Sequelize);
db.view = require("../models/views.model.js")(sequelize, Sequelize);

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

db.image.belongsTo(db.category, {
  foreignKey: "categoryId",
  as: "category",
  targetKey: "id",
});

// db.image.hasMany(db.marketplace);

// db.users.hasMany(db.marketplace, {
//   foreignKey: "ownerEmail",
//   as: "owner",
// });

db.marketplace.belongsTo(db.users, {
  foreignKey: "ownerEmail",
  as: "owner",
  targetKey: "email",
});

// db.users.hasMany(db.marketplace, {
//   foreignKey: "buyerEmail",
//   as: "buyer",
// });
db.marketplace.belongsTo(db.users, {
  foreignKey: "buyerEmail",
  as: "buyer",
  targetKey: "email",
});

db.marketplace.belongsTo(db.image, {
  foreignKey: "product",
  targetKey: "id",
});

db.marketHistory.belongsTo(db.marketplace, {
  foreignKey: "marketplaceId",
  as: "marketplace",
  targetKey: "id",
});

db.marketHistory.belongsTo(db.users, {
  foreignKey: "userEmail",
  as: "user",
  targetKey: "email",
});

db.view.belongsTo(db.users, {
  foreignKey: "userEmail",
  as: "user",
  targetKey: "email",
  allowNull: true,
});

db.view.belongsTo(db.marketplace, {
  foreignKey: "marketplaceId",
  as: "marketplace",
  targetKey: "id",
});

db.view.belongsTo(db.image, {
  foreignKey: "imageId",
  as: "image",
  targetKey: "id",
});

db.ROLES = ["user", "admin"];

module.exports = db;
