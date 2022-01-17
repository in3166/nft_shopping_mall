const { FOREIGNKEYS } = require("sequelize/dist/lib/query-types");

module.exports = (sequelize, Sequelize) => {
  const MarketHistory = sequelize.define("markethistories", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    action: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    starting_time: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });

  return MarketHistory;
};
