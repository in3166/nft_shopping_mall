// fileUpload.js
const express = require("express");
const router = express.Router();
const multer = require("multer"); // npm install multer

var fs = require("fs");
var dir = "uploads/";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    //console.log("BODY:", req.body.body);
    const body = JSON.parse(req.body.body);
    console.log(file)
    if (!fs.existsSync(dir + body.email)) {
      fs.mkdirSync(dir + body.email);
    }

    console.log("ffile1: ", file);
    callback(null, `uploads/${body.email}`); //업로드 파일의 저장 위치를 설정
  },
  filename: (req, file, callback) => {
    callback(null, new Date().valueOf() + `${file.originalname}`); // 파일이 저장될 때 이름 설정, tiemstamp로 파일 중복 피함
  },
});

const limits = {
  files: 50,
  fileSize: 1024 * 1024 * 1024, //1G
};

const upload = multer({ storage, limits }).single("file");

router.post("/", (req, res) => {
  // let path = req.query.path;
  const reqFiles = [];

  upload(req, res, (err) => {
    console.log("err: ", err);
    if (err) {
      return res.status(400).json({ success: false, err, message: err });
    }

    // for (let i = 0; i < req.files?.length; i++) {
    //   reqFiles.push(req.body.file[i].fileName);
    // }
    
    const body = JSON.parse(req.body.body);
    console.log("body2: ", body);
    return res.status(200).json({
      success: true,
      //url: res.req.file.path,
      msg: "파일 업로드를 성공했습니다.",
    });
  });

  return;
});

module.exports = router;
