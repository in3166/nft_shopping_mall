const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
  const Banners = sequelize.define("banners", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    ownerEmail: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    current_price: {
      type: Sequelize.INTEGER,
    },
    url: {
      type: Sequelize.STRING,
    },
    tokenId: {
      type: Sequelize.INTEGER,
    },
  });

  return Banners;
};
