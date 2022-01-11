module.exports = (sequelize, Sequelize) => {
  const View = sequelize.define("views", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ip: {
      type: Sequelize.STRING,
    },
    client_url: {
      type: Sequelize.STRING,
    },
    server_url: {
      type: Sequelize.STRING,
    },
  });

  return View;
};
