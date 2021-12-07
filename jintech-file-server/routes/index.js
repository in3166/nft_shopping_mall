var express = require('express');
var router = express.Router();
var multer = require('multer');
var dotenv = require('dotenv');
dotenv.config();

var storage = multer({
  destination: multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, process.env.FILE_PATH);
    },
    filename: function(req, file, cb){
      cb(null, file.originalname);
    },
    fileFilter:(req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, true);
    }
  })
})

const upload = multer({storage: storage}).single('file');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/uploadfile', (req, res) => {
  upload(req, res, err => {
    if(err) {
      return res.json({success:false, err});
    }

    return res.json({success:true, url: res.req.file.path, fileName: res.req.file.fileName});
  })
})

module.exports = router;
