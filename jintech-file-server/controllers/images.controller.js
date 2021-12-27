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

//
exports.findOne = async (req, res) => {};

exports.getFile = async (req, res) => {
  const path = req.params.path;
  console.log('path: ',path);
  fs.readFile
  res.sendFile("/" + path);
};

// Retrieve all User from the database.
exports.findAll = (req, res) => {
  //var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;

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
