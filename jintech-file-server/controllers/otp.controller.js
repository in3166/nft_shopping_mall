const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;
const OTP = db.otp;
const Role = db.role;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");

const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

exports.create = async (req, res) => {
  // Save User to Database
  const secret = speakeasy.generateSecret({ name: "nft2auth" });
  const email = req.body.email;

  const result = await User.update({ otp: "Y" }, { where: { email: email } })
    .then(async (data) => {
      const otpIsExist = await OTP.findOne({ where: { email: email } });
      const url = await qrcode.toDataURL(secret.otpauth_url);
      console.log(otpIsExist, "otpIsExist");
      console.log(url);
      if (url) {
        if (!otpIsExist) {
          OTP.create({ email: email, secret: secret.base32, url: url })
            .then((otp) => {
              console.log("otp 생성 완료: ", otp);
              res.status(200).send({
                url: url,
                secret: secret.base32,
              });
            })
            .catch((err) => {
              console.log("otp create err: ", err);
              res.status(400).send({ error: err, message: "otp create err" });
            });
        } else {
          // 있으면 새로 생성 => Reset
          OTP.update(
            { secret: secret.base32, url: url },
            { where: { email: email } }
          )
            .then((data) => {
              console.log("otp update 완료: ", data);
              res.status(200).send({
                url: url,
                secret: secret.base32,
              });
            })
            .catch((err) => {
              console.log("otp update err: ", err);
              res.status(400).send({ error: err, message: "otp update err" });
            });
        }
      } else {
        console.log("url err");
      }
    })
    .catch((err) => {
      console.log("user update Y err: ", err);
      res.status(400).send({ error: err, message: err });
    });

  console.log("result: ", result);
};

// 
exports.findOne = async (req, res) => {
  const email = req.params.email;
  await User.update({ otp: "Y" }, { where: { email: email } });
  await OTP.findOne({ where: { email: email } })
    .then((otp) => {
      if (otp) {
        res.status(200).send({
          url: otp.url,
          secret: otp.secret,
        });
      } else {
        // DB에 없으면 생성
        req.body.email = email;
        this.create(req, res);
      }
    })
    .catch((err) => {
      console.log("otp get err: ", err);
      res.status(400).send({ error: err, message: "otp get err" });
    });
};
