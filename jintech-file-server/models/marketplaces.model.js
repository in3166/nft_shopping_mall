const { FOREIGNKEYS } = require("sequelize/dist/lib/query-types");

module.exports = (sequelize, Sequelize) => {
  const Marketplace = sequelize.define("marketplaces", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // owner: {
    //   type: Sequelize.STRING,
    //   references: {
    //     model: "users",
    //     key: "email",
    //   },
    // },
    // product: {
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: "images",
    //     key: "id",
    //   },
    // },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    starting_time: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    current_price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    limit_hours: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    onMarket: {
      type: Sequelize.BOOLEAN,
      default: true,
    },
    soldOut: {
      type: Sequelize.BOOLEAN,
      default: false,
    },
  });

  return Marketplace;
};
