const db = require("../models");
const Favorite = db.favorite;

exports.create = async (req, res) => {
  console.log("create: ", req.body);
  Favorite.findAll({
    where: {
      userEmail: req.body.userEmail,
      marketplaceId: req.body.marketplaceId,
    },
  })
    .then((data) => {
      if (data.length === 0) {
        Favorite.create(req.body)
          .then((result) => {
            return res.status(200).send({ success: true, status: true });
          })
          .catch((err) => {
            console.log("fav create err: ", err);
            return res
              .status(400)
              .send({ success: false, error: err, message: err });
          });
      } else {
        Favorite.destroy({
          where: {
            userEmail: req.body.userEmail,
            marketplaceId: req.body.marketplaceId,
          },
        })
          .then((result) => {
            return res.status(200).send({ success: true, status: false });
          })
          .catch((err) => {
            console.log("fav des err: ", err);
            return res
              .status(400)
              .send({ success: false, error: err, message: err });
          });
      }
    })
    .catch((err) => {
      console.log("fav err: ", err);
      return res.status(400).send({ success: false, error: err, message: err });
    });
};

exports.findAll = async (req, res) => {
  const email = req.params.email;
  console.log("findone", email);

  Favorite.findAll({ where: { userEmail: email } })
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
  const marketplaceId = req.params.marketplaceId;
  console.log("findone", email, marketplaceId);

  Favorite.findAll({ where: { userEmail: email, marketplaceId } })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};
