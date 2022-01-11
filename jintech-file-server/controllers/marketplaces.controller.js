const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const multerFile = require("../middleware/multerFile");
const Marketplace = db.marketplace;
var fs = require("fs");

exports.create = async (req, res) => {
  const body = req.body;
  console.log("body: ", body);

  Marketplace.create(body)
    .then((createData) => {
      console.log("createData: ", createData);

      return res.status(200).json({
        success: true,
        //url: res.req.file.path,
        msg: "상품 등록을 성공했습니다.",
      });
    })
    .catch((err) => {
      console.log("db err: ", err);
      return res.status(400).json({ success: false, err, message: err });
    });
};

var path = require("path");
const { users, images } = require("../models");

exports.findOne = (req, res) => {
  const id = req.params.id;
  console.log("goods: ", id);
  Marketplace.findOne({
    where: { id },
    include: [
      // { association: "owner" },
      {
        model: db.users,
        attributes: ["email", "address"],
        as: "owner",
      },
      {
        model: db.image,
        attributes: [
          "categoryId",
          "filename",
          "type",
          "url",
          "price",
          "period",
          "type",
          "buyout",
          "markup",
          "key",
          "onMarket",
          "description",
          "id",
        ],
      },
    ],
  })
    .then((info) => {
      console.log("return :", info);
      return res.status(200).json({ success: true, info: info });
    })
    .catch((err) => {
      console.log("err: ", err);
      return res.status(400).json({ success: false, err, message: err });
    });
};

// Retrieve all User from the database.
exports.findAll = (req, res) => {
  //var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;
  console.log("findall");

  Marketplace.findAll({
    include: [
      {
        model: db.users,
        attributes: ["email", "address"],
        as: "owner",
      },
      {
        model: db.image,
        attributes: [
          "filename",
          "type",
          "url",
          "price",
          "period",
          "type",
          "buyout",
          "markup",
          "key",
          "onMarket",
        ],
      },
    ],
  })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};

exports.update = (req, res) => {
  //var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;
  console.log("update", req.body);
  const key = req.body.key;
  const id = req.body.id;
  console.log("key: ", key);
  console.log("id: ", id);

  Marketplace.update(
    { key },
    {
      where: { id },
    }
  )
    .then((num) => {
      console.log(num);
      res.status(500).send({ success: true });
    })
    .catch((err) => {
      console.log("err: ", err);
      res.status(500).send({ message: err, error: err });
    });
};
