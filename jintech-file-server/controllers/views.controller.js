const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const multerFile = require("../middleware/multerFile");
const View = db.view;

const countsBody = [];

const addCount = () => {
  console.log("interval");
  if (countsBody.length > 0) {
    console.log(countsBody);
    View.bulkCreate(countsBody)
      .then((createData) => {
        console.log("Add count: ", createData);
        countsBody.length = 0;
        console.log(countsBody);
      })
      .catch((err) => {
        console.log("view count Error: ", err);
        countsBody.length = 0;
      });
  }
};

const setIntervalQuery = {
  inteval: () =>
    setInterval(() => {
      addCount();
    }, 1000 * 60 * 60),
};

const clearIntevalQuery = () => {
  clearInterval(setIntervalQuery.inteval);
};

setIntervalQuery.inteval();

var fs = require("fs");

exports.create = async (req, res) => {
  // req.protocol + "://" + req.get("host") +
  const server_url = req.originalUrl;
  console.log(req.body);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const client_id = req.body.client_id;
  console.log("url: ", server_url);
  console.log("ip: ", ip);
  console.log("client_id: ", client_id);
  const data = {
    ...req.body,
    server_url,
    ip,
  };

  countsBody.push(data);
};

exports.findAll = async (req, res) => {
  const email = req.params.email;
  console.log("findone", email);

  View.findAll()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
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

exports.count = (req, res) => {
  //var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;
  const id = req.params.marketId;
  console.log("countcount: ", id);
  View.count({ where: { marketplaceId: id } })
    .then((data) => {
      console.log("count: ", data);
      res.status(200).send({ success: true, count: data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};
