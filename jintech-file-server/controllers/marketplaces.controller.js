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

exports.getFile = (req, res) => {
  const id = req.params.id;
  console.log("goods: ", id);
  Marketplace.findAll({
    include: [
      { association: 'a_owner' },
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
    .then((info) => {
      console.log("return :", info);
      return res.status(200).json({ success: true, info: info });
    })
    .catch((err) => {
      return res.status(400).json({ success: false, err, message: err });
    });
};

// exports.getFile = (req, res) => {
//   const url = req.query.path;
//   const path2 = url.replaceAll(/\\/g, "/").trim();
//   console.log("1path: ", path2);
//   try {
//     res.sendFile(path.resolve(path2));
//   } catch (error) {
//     console.log(error);
//   }
//   // fs.readFile("/" + path2, (err, data) => {
//   //   console.log('err: ',err);
//   //   console.log(data);
//   // });
// };

exports.findOne = async (req, res) => {
  console.log("findone");
  const email = req.params.email;
  console.log("findone", email);

  Marketplace.findAll({
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

  Marketplace.findAll({
    include: [
      {
        model: db.users,
        attributes: ["email", "address"],
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
