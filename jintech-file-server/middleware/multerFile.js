const multer = require("multer"); // npm install multer

var fs = require("fs");
var dir = "uploads/";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    //console.log("BODY:", req.body.body);
    const body = JSON.parse(req.body.body);
    console.log("dir: ", dir);
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads", (err) => {
        if (err) {
          console.log("mkdir err: ", err);
        } else {
          if (!fs.existsSync(dir + body.email)) {
            console.log("make1");
            fs.mkdirSync(dir + body.email, (err) => {
              if (err) {
                console.log("mkdir err: ", err);
              } else {
                callback(null, `uploads/${body.email}`); //업로드 파일의 저장 위치를 설정
              }
            });
          }
        }
      });
    } else {
      if (!fs.existsSync(dir + body.email)) {
        console.log("make2");
        fs.mkdirSync(dir + body.email, (err) => {
          if (err) {
            console.log("mkdir err: ", err);
          } else {
            callback(null, `uploads/${body.email}`); //업로드 파일의 저장 위치를 설정
          }
        });
      } else {
        callback(null, `uploads/${body.email}`); //업로드 파일의 저장 위치를 설정
      }
    }
  },
  filename: (req, file, callback) => {
    const body = JSON.parse(req.body.body);
    callback(null, req.currentTime + `_${file.originalname}`); // 파일이 저장될 때 이름 설정, tiemstamp로 파일 중복 피함
  },
});

const limits = {
  files: 50,
  fileSize: 1024 * 1024 * 1024, //1G
};

const upload = multer({ storage, limits }).single("file");

const multerFile = {
  upload: upload,
};

module.exports = multerFile;
