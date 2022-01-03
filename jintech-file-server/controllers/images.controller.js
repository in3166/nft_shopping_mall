const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const multerFile = require("../middleware/multerFile");
const IMAGE = db.image;
var fs = require("fs");

exports.create = async (req, res) => {
  req.currentTime = new Date().valueOf();

  multerFile.upload(req, res, (err) => {
    console.log("err: ", err);
    if (err) {
      return res.status(400).json({ success: false, err, message: err });
    }

    // for (let i = 0; i < req.files?.length; i++) {
    //   reqFiles.push(req.body.file[i].fileName);
    // }

    const body = JSON.parse(req.body.body);

    const filename = req.file.filename;
    const path = req.file.path;
    const destination = req.file.destination;

    const data = {
      email: body.email,
      type: body.type,
      filename: filename,
      path: path,
      url: body?.url,
      price: body.price,
      buyout: body?.buyout,
      period: body?.period,
      markup: body?.markup,
      description: body?.description,
    };

    console.log("data: ", data);

    IMAGE.create(data)
      .then((createData) => {
        console.log("createData: ", createData);

        return res.status(200).json({
          success: true,
          //url: res.req.file.path,
          msg: "파일 업로드를 성공했습니다.",
        });
      })
      .catch((err) => {
        console.log("db err: ", err);
        return res.status(400).json({ success: false, err, message: err });
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
  IMAGE.findAll()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};
