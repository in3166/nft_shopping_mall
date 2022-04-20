const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
  const Categories = sequelize.define("categories", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
  });

  return Categories;
};
