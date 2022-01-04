const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
  const Banners = sequelize.define("banners", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    owner: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    price: {
      type: Sequelize.INTEGER,
    },
    token: {
      type: Sequelize.STRING,
    },
    url: {
      type: Sequelize.STRING,
    },
    key: {
      type: Sequelize.INTEGER,
    },
  });

  return Banners;
};
