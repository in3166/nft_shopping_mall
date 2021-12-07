const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const { smtpTransport } = require("../config/email.config");

// 중복 확인 먼저해야

const authentication = async (email, authCode) => {
  //const email = req.body.email;
  // console.log(email);
  // var condition = { email: { [Op.iLike]: `%${email}%` }, auth: "Y" };

  // User.findAll({ where: condition }).then((data) => {
  //   console.log("find data", data);
  //   if (data.length > 0) {
  //     res.status(200).send({
  //       duplication: true,
  //       message: "E-Mail이 이미 존재합니다.",
  //     });
  //   }

  // console.log("받은 이메일", email, "코드: ", authCode)
  // await User.update({ auth: authCode }, { where: { email: email } }).then(
  //   async (data) => {
  //     if (data) {
  //       console.log("authcode 생성 후 저장", data);
  //     }
  //   }
  // ).catch(err=>{
  //   console.log("auth err update: ", err)
  //   return err;
  // });

  // setTimeout(async () => {
  //   await User.update(
  //     { auth: "N" },
  //     { where: { auth: { [Op.iLike]: `%${authCode}%` } } }
  //   ).then(async (data) => {
  //     if (data) {
  //       console.log(data);
  //     }
  //   });
  // }, 60 * 60 * 1000);

  const mailOptions = {
    from: "NFT E-Mail 인증",
    to: email,
    subject: "[NFT] 이메일 인증관련 메일입니다.",
    text:
      "다음 링크를 클릭하세요.: " +
      "http://localhost:3000/api/users/verify?email=" +
      email +
      "&code=" +
      authCode,
  };

  smtpTransport.sendMail(mailOptions, (error, responses) => {
    if (error) {
      console.log("err? : ", error);
      return error;
      // return res.status(400).send({
      //   message: error,
      // });
    }
    // else {
    //   console.log("200 send");
    //   return res.status(200).send();
    // }
  });

  smtpTransport.close();
  //});
};

// 이메일 인증
exports.verify = async (req, res) => {
  const email = req.query.email;
  const code = req.query.code;
  
  const user = await User.findOne({
    where: { email: email },
    attributes: ["auth"],
  });

  const authCode = user.dataValues.auth;

  if (authCode === code) {
    User.update({ auth: "Y" }, { where: { email: email } })
      .then(async (data) => {
        if (data) {
          console.log("ver: ", data);
        }
        res.redirect("/success");
      })
      .catch((err) => {
        console.log("ver err", err);
        res.redirect("/fail");
      });
  } else {
    res.redirect("/fail");
  }
};

// Create and Save a new User
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({
      message: "Email can not be empty!",
    });
    return;
  }
  //{ [Op.iLike]: `%${req.body.email}%` }
  var condition = { email: req.body.email };

  // 중복 체크
  await User.findAll({ where: condition })
    .then(async (data) => {
      console.log("find data", data);
      if (data.length > 0) {
        res.status(400).send({
          message: "E-Mail이 이미 존재합니다.",
        });
      } else {

        const authCode = String(Math.random().toString(36).slice(2)); //? 랜덤 문자열 생성
        const user = {
          email: req.body.email,
          password: req.body.password,
          address: req.body.address,
          auth: authCode,
        };


        // 인증메일 발송
        const error = await authentication(req.body.email, authCode);

        if (!error) {
          // 한 시간 뒤 auth 컬럼이 "Y"가 아니면 "N"으로 변경
          setTimeout(async () => {
            const user = await User.findOne({
              where: { email: req.body.email },
              attributes: ["auth"],
            });

            const authCode = user.dataValues.auth;
            if (authCode !== "Y") {
              await User.update(
                { auth: "N" },
                { where: { email: req.body.email } }
              ).then(async (data) => {
                if (data) {
                  console.log(req.body.email, " 의 auth N");
                }
              });
            }
          }, 60 * 60 * 1000);

          User.create(user)
            .then((data) => {
              res.status(200).send(data);
            })
            .catch((err) => {
              res.status(500).send({
                error: err.message,
                message: "사용자 생성 오류",
              });
            });
        } else {
          res.status(500).send({
            error: error,
            message: "인증 메일 발송 오류",
          });
        }
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "중복 체크 오류",
      });
    });
};

// Retrieve all User from the database.
exports.findAll = (req, res) => {
  const email = req.query.email;
  var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;

  User.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};

// Find a single User with an id
exports.findOne = (req, res) => {
  const email = req.params.email;

  User.findByPk(email)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with email=${email}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with email=" + email,
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const email = req.params.email;

  User.update(req.body, {
    where: { email: email },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with email=${email}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with email=" + email,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const email = req.params.email;

  User.destroy({
    where: { email: email },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with email=${email}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with email=" + email,
      });
    });
};

// Delete all User from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Users were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Users.",
      });
    });
};

// exports.findAllPublished = (req, res) => {
//   Tutorial.findAll({ where: { published: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving tutorials."
//       });
//     });
// };


// 로그인 시 비밀번호 암호화 비교하기 
// https://javascript.plainenglish.io/password-encryption-using-bcrypt-sequelize-and-nodejs-fb9198634ee7