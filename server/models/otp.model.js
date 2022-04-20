const { FOREIGNKEYS } = require("sequelize/dist/lib/query-types");
const usersModel = require("./users.model");

module.exports = (sequelize, Sequelize) => {
  const OTP = sequelize.define(
    "otps",
    {
      email: {
        type: Sequelize.STRING,
        references: {
          model: "users",
          key: "email",
        },
        primaryKey:true,
      },
      secret: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.TEXT,
      },
    },
    {
      initialAutoIncrement: 1,
    }
  );

  return OTP;
};
