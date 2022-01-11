const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const multerFile = require("../middleware/multerFile");
const View = db.view;

var fs = require("fs");

exports.create = async (req, res) => {
  // req.protocol + "://" + req.get("host") +
  const server_url = req.originalUrl;
  console.log(req.body);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log("url: ", server_url);
  console.log("ip: ", ip);
  const data = {
    ...req.body,
    server_url,
    ip,
  };

  View.create(data)
    .then((createData) => {
      console.log("count 추가: ", createData);

      // return res.status(200).json({
      //   success: true,
      //   //url: res.req.file.path,
      //   message: "조회수.",
      // });
    })
    .catch((err) => {
      console.log("db err: ", err);
      //return res.status(400).json({ success: false, err, message: err });
    });
};

exports.findOne = async (req, res) => {
  const email = req.params.email;
  console.log("findone", email);

  View.findAll({
    where: { email: email },
  })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};

// Retrieve all User from the database.
exports.findAll = (req, res) => {
  //var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;
  console.log("findall");
  View.findAll()
    .then((data) => {
      res.status(200).send({ success: true, categories: data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};
