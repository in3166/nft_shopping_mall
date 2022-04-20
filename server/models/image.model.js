const { FOREIGNKEYS } = require("sequelize/dist/lib/query-types");
const usersModel = require("./users.model");

module.exports = (sequelize, Sequelize) => {
  const IMAGE = sequelize.define(
    "images",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      key: {
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        references: {
          model: "users",
          key: "email",
        },
        allowNull: false,
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
      },
      path: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      period: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      buyout: {
        type: Sequelize.INTEGER,
      },
      markup: {
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.TEXT,
      },
      approval: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      onMarket: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    }
    // {
    //   defaultScope: { where: { id: true } },
    // }
  );

  return IMAGE;
};
