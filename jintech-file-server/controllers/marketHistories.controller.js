const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const multerFile = require("../middleware/multerFile");
const MarketHistory = db.marketHistory;
const Marketplace = db.marketplace;
var fs = require("fs");

exports.create = async (req, res) => {
  const body = req.body;
  console.log("body: ", body);

  MarketHistory.create({
    action: body.action,
    price: body.price,
    userEmail: body.userEmail,
    marketplaceId: body.marketplaceId,
    starting_time: body.starting_time,
  })
    .then((createData) => {
      // console.log("createData: ", createData);
      if (body.action === "bid") {
        Marketplace.update(
          { current_price: body.price, buyerEmail: body.userEmail },
          {
            where: {
              id: body.marketplaceId,
            },
          }
        )
          .then((bid) => {
            res.status(200).send({ success: true, current_price: body.price });
          })
          .catch((err) => {
            console.log("soldout err: ", err);
            console.log(createData.id);
            MarketHistory.destroy({ where: { id: createData.id } })
              .then((del) => {
                return res.json({ success: false, err, message: err });
              })
              .catch((err) => {
                console.log("delete history err: ", err);
                return res.json({
                  success: false,
                  err,
                  message: "delete 실패",
                });
              });
          });
      } else if (body.action === "buy") {
        // marketplace에서 내리기
        Marketplace.update(
          {
            soldOut: true,
            current_price: body.price,
            ownerEmail: body.userEmail,
            buyerEmail: body.userEmail,
            onMarket: false,
          },
          {
            where: {
              id: body.marketplaceId,
            },
          }
        )
          .then((sold) => {
            // 판매 히스토리 추가
            MarketHistory.create({
              action: "sale",
              price: body.price,
              userEmail: body.ownerEmail,
              marketplaceId: body.marketplaceId,
              starting_time: body.starting_time,
            })
              .then((data) => {
                res.status(200).send({
                  success: true,
                  current_price: body.price,
                });
              })
              .catch((err) => {
                console.log("add sale history err: ", err);
              });
          })
          .catch((err) => {
            console.log("but soldout err: ", err);

            MarketHistory.destroy({ where: { id: createData.id } })
              .then((del) => {
                return res.json({ success: false, err, message: err });
              })
              .catch((err) => {
                console.log("delete history err: ", err);
                return res.json({
                  success: false,
                  err,
                  message: "delete 실패",
                });
              });
          });
      }
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
  MarketHistory.findOne({
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
  const id = req.params.id;
  const starting_time = req.get("starting_time");
  console.log("findall", id);

  MarketHistory.findAll({
    where: {
      marketplaceId: id,
      // starting_time,
    },
    order: [["createdAt", "DESC"]],
  })
    .then((data) => {
      res.status(200).send({ success: true, history: data });
    })
    .catch((err) => {
      console.log("find history all: ", err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};

// Retrieve all User from the database.
exports.findAllSales = (req, res) => {
  //var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;
  console.log("findall");
  const id = req.params.id;

  MarketHistory.findAll({
    where: {
      action: "sale",
    },
    include: [
      // { association: "owner" },
      // {
      //   model: db.marketplace,
      //   attributes: ["id"],
      //   as: "marketplace",
      // },
      {
        model: db.image,
        attributes: ["filename", "url", "description"],
        as: "image",
      },
    ],
    order: [["createdAt", "DESC"]],
  })
    .then((data) => {
      res.status(200).send({ success: true, sales: data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};

exports.findUserSales = (req, res) => {
  //var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;
  console.log("findusersale");
  const email = req.params.email;
  console.log("findusersale", email);

  MarketHistory.findAll({
    where: {
      action: "sale",
      userEmail: email,
    },
    include: [
      {
        model: db.marketplace,
        attributes: ["id"],
        as: "marketplace",
      },
      {
        model: db.image,
        attributes: ["filename", "url", "description"],
        as: "image",
      },
    ],
    order: [["createdAt", "DESC"]],
  })
    .then((data) => {
      res.status(200).send({ success: true, saleHistory: data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};

exports.findUserBuys = (req, res) => {
  //var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;
  console.log("findUserBuys");
  const email = req.params.email;
  console.log("findUserBuys", email);

  MarketHistory.findAll({
    where: {
      action: "buy",
      userEmail: email,
    },
    include: [
      {
        model: db.marketplace,
        attributes: ["id"],
        as: "marketplace",
      },
      {
        model: db.image,
        attributes: ["filename", "url", "description"],
        as: "image",
      },
    ],
    order: [["createdAt", "DESC"]],
  })
    .then((data) => {
      res.status(200).send({ success: true, buyHistory: data });
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

  MarketHistory.update(
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
