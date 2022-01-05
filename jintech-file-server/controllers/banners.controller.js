const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const multerFile = require("../middleware/multerFile");
const Banner = db.banner;

var fs = require("fs");

exports.create = async (req, res) => {
  const banners = req.body;
  console.log("banners: ", banners);

  Banner.bulkCreate(banners)
    .then((createData) => {
      console.log("createData: ", createData);

      return res.status(200).json({
        success: true,
        //url: res.req.file.path,
        message: "배너를 추가했습니다.",
      });
    })
    .catch((err) => {
      console.log("db err: ", err);
      return res.status(400).json({ success: false, err, message: err });
    });
};

exports.update = async (req, res) => {
  const name = req.body.name;
  const id = req.body.id;
  console.log("cate: ", name, id);

  // const data = {
  //   email: body.email,
  //   type: body.type,
  // };

  console.log("data: ", { name });

  Banner.update({ name }, { where: { id } })
    .then((updated) => {
      console.log("updatedData: ", updated);

      return res.status(200).json({
        success: true,
        message: "카테고리 수정",
      });
    })
    .catch((err) => {
      console.log("db err: ", err);
      return res.status(400).json({ success: false, err, message: err });
    });
};

exports.delete = async (req, res) => {
  const id = req.body.id;
  //console.log("bnaner id: ", id);

  Banner.destroy({
    where: { id },
  })
    .then((num) => {
      console.log("num: ", num);
      if (num !== 0) {
        res.status(200).send({
          success: true,
          message: "User was deleted successfully!",
        });
      } else {
        res.status(200).send({
          success: false,
          message: `Cannot delete some category.`,
        });
      }
    })
    .catch((err) => {
      console.log("err: ", err);
      res.status(500).send({
        message: "Could not delete some category.",
      });
    });
};

exports.findOne = async (req, res) => {
  const email = req.params.email;
  console.log("findone", email);

  Banner.findAll({
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
  Banner.findAll()
    .then((data) => {
      console.log(data);
      res.status(200).send({ success: true, banners: data });
    })
    .catch((err) => {
      console.log("err: ", err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Banners.",
      });
    });
};
