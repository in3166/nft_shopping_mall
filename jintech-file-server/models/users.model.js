const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define(
    "users",
    {
      email: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      password: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING,
      },
      email_verification: {
        type: Sequelize.STRING,
        default: "N",
      },
      leave: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      otp: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
    },
    {
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSaltSync(10, "a");
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
        beforeUpdate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSaltSync(10, "a");
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
      },
      instanceMethods: {
        validPassword: (password) => {
          return bcrypt.compareSync(password, this.password);
        },
      },
    }
  );

  Users.prototype.validPassword = async (password, hash) => {
    return await bcrypt.compareSync(password, hash);
  };

  return Users;
};
