var express = require("express");
var router = express.Router();
const otps = require("../controllers/otp.controller");
const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const db = require("../models");

const User = db.users;
const OTP = db.otp;

// otp 새로 생성
router.post("/", otps.create);

// otp 가져오기
router.get("/:email", otps.findOne);

// otp  비활성
router.put("/:email", (req, res) => {
  const email = req.params.email;
  console.log("email: ", email);
  User.update({ otp: false }, { where: { email: email } })
    .then((data) => {
      console.log("success: ", data);
      res.status(200).send({
        data,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ error: err, message: "otp put err" });
    });
});

router.post("/verify", async (req, res) => {
  const code = req.body.code;
  const email = req.body.email;
  console.log("-------", code, email);

  const otp = await OTP.findOne({ where: { email: email } });
  if (otp) {
    console.log("otp 찾음");
    console.log(otp);
    const verify = speakeasy.totp.verify({
      secret: otp.secret,
      encoding: "base32",
      token: code,
    });
    console.log("verify: ", verify);
    res.status(200).send({
      success: true,
      verify,
    });
  }
});

module.exports = router;
