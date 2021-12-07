// fileUpload.js
const express = require("express");
const router = express.Router();
const multer = require("multer"); // npm install multer

router.post("/", (req, res) => {
  let path = req.query.path;
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, `${path}`);	//업로드 파일의 저장 위치를 설정
    },
    filename: (req, file, callback) => {
        callback(null, `${file.originalname}`);	// 파일이 저장될 때 이름 설정
    },
  });
  
  const limits = {
    files: 50,
    fileSize: 1024 * 1024 * 1024, //1G
  }

  const upload = multer({ storage, limits }).any();

  const reqFiles = [];

  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }

    for(let i = 0; i < req.files.length; i++) {
      reqFiles.push(req.files[i].fileName);
    }

    return res.json({
      success: true,
      //url: res.req.file.path,
      fileName: reqFiles,
    });
  });

  return;
 });
 
module.exports = router;