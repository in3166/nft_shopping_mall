const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
  const Favorites = sequelize.define("favorites", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  });

  return Favorites;
};
