const multer = require("multer"); // npm install multer

var fs = require("fs");
var dir = "uploads/";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    //console.log("BODY:", req.body.body);
    const body = JSON.parse(req.body.body);
    if (!fs.existsSync(dir + body.email)) {
      fs.mkdirSync(dir + body.email);
    }

    console.log("ffile1: ", file); // fieldname: file, originalname: 파일 이름.확장자, encoding: 7bit, mimetype: 'image/jpeg'
    callback(null, `uploads/${body.email}`); //업로드 파일의 저장 위치를 설정
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
