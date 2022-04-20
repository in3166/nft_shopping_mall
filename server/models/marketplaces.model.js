const { FOREIGNKEYS } = require("sequelize/dist/lib/query-types");

module.exports = (sequelize, Sequelize) => {
  const Marketplace = sequelize.define("marketplaces", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // owner => index
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
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
    contractAddress: {
      type: Sequelize.STRING,
    },
    tokenId: {
      type: Sequelize.INTEGER,
    },
    networkId: {
      type: Sequelize.INTEGER,
    },
    limit_hours: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    onMarket: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    soldOut: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    url: {
      type: Sequelize.STRING,
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
  });

  return Marketplace;
};
