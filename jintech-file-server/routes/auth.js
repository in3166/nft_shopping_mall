var express = require("express");
var router = express.Router();
const users = require("../controllers/users.controller");
const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const secret = speakeasy.generateSecret({ name: "nft2auth" });
router.post("/", (req, res) => {
    
  qrcode.toDataURL(secret.otpauth_url, (err, data) => {
    console.log(data);
    if (err) console.log("qrerr: ", err);
    res.status(200).send({
      url: data,
      secret: secret,
    });
  });
});

router.post("/verify", (req, res) => {
    console.log('??');
    const code =req.body.code;
    const secret =req.body.secret;
    console.log(code);
    console.log('??');
    
    console.log(secret);

    const verify = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: code,
    })
    console.log("verify: ", verify);
});

module.exports = router;
