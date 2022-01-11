const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const multerFile = require("../middleware/multerFile");
const Category = db.category;

var fs = require("fs");

exports.create = async (req, res) => {
  const name = req.body.name;
  console.log("cate: ", name);

  // const data = {
  //   email: body.email,
  //   type: body.type,
  // };

  console.log("data: ", { name });

  Category.create({ name })
    .then((createData) => {
      console.log("createData: ", createData);

      return res.status(200).json({
        success: true,
        //url: res.req.file.path,
        message: "파일 업로드를 성공했습니다.",
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

  Category.update({ name }, { where: { id } })
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
  console.log("cate: ", id);

  Category.destroy({
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

var path = require("path");

exports.getFile = (req, res) => {
  const url = req.query.path;
  const path2 = url.replaceAll(/\\/g, "/").trim();
  console.log("1path: ", path2);
  try {
    res.sendFile(path.resolve(path2));
  } catch (error) {
    console.log(error);
  }
  // fs.readFile("/" + path2, (err, data) => {
  //   console.log('err: ',err);
  //   console.log(data);
  // });
};

exports.findOne = async (req, res) => {
  const email = req.params.email;
  console.log("findone", email);

  IMAGE.findAll({
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
  Category.findAll()
    .then((data) => {
      res.status(200).send({ success: true, data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};
