const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

const { smtpTransport } = require("../config/email.config");

const config = require("../config/auth.config");
const Role = db.role;

var jwt = require("jsonwebtoken");
let from = `NFT-Jintech <in@gmail.com>`;
// 중복 확인 먼저해야?
const authentication = async (email, authCode) => {
  const mailOptions = {
    from: from,
    to: email,
    subject: "[NFT] 이메일 인증관련 메일입니다.",
    text:
      "다음 링크를 클릭하세요.: " +
      "http://localhost:15001/api/users/verify?email=" +
      email +
      "&code=" +
      authCode,
    html: `<h1>[NFT] 이메일 인증관련 메일입니다.</h1>
          <br/>
          <div><strong>다음의 링크를 클릭해주세요.</strong></div>
          <br/>
          <div>
            <a href="http://localhost:15001/api/users/verify?email=${email}&code=${authCode}">이메일 인증 링크</a>
          </div>
          <br/>`,
  };

  try {
    const res = await smtpTransport.sendMail(mailOptions);
    console.log("res2", res);
    return false;
  } catch (error) {
    console.log("catch error: ", error);
    return error;
  } finally {
    smtpTransport.close();
  }

  //   , (error, users) => {
  //   if (error) {
  //     console.log("err? : ", error);
  //     return error;
  //     // return res.status(400).send({
  //     //   message: error,
  //     // });s
  //   }
  //   // else {
  //   //   console.log("200 send");
  //   //   return res.status(200).send();
  //   // }
  // });
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
        res.cookie("valid", true);
        res.redirect("/success");
      })
      .catch((err) => {
        res.cookie("valid", true);
        res.redirect("/fail");
      });
  } else {
    //req.session['valid'] = true
    res.cookie("valid", true);
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
        // 이메일 인증 문자열
        const authCode = String(Math.random().toString(36).slice(2)); //? 랜덤 문자열 생성
        const user = {
          email: req.body.email,
          password: req.body.password,
          address: req.body.address,
          auth: authCode,
          leave: "N",
          otp: "N",
        };
        console.log("발송");
        // 인증메일 발송
        const error = await authentication(req.body.email, authCode);
        if (!error) {
          // 한 시간 뒤 auth 컬럼이 "Y"가 아니면 "N"으로 변경
          try {
            setTimeout(async () => {
              const user = await User.findOne({
                where: { email: req.body.email },
                attributes: ["auth"],
              });

              const authDBCode = user.dataValues.auth;
              if (authDBCode !== "Y") {
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
          } catch (error) {
            console.log("settimeout error: ", error);
            res.status(400).send({ error: error, message: error });
          }

          User.create(user)
            .then((resUser) => {
              if (req.body.roles) {
                Role.findAll({
                  where: {
                    name: {
                      [Op.or]: req.body.roles,
                    },
                  },
                }).then((roles) => {
                  resUser.setRoles(roles).then(() => {
                    res.send({ message: "User was registered successfully!" });
                  });
                });
              } else {
                // user role = 1
                resUser.setRoles([1]).then(() => {
                  res.send({ message: "User was registered successfully!" });
                });
              }
            })
            .catch((err) => {
              res.status(500).send({
                error: err.message,
                message: err.message,
              });
            });
        } else {
          console.log("error send2", error);
          res.status(500).send({
            error: error,
            message: "인증 메일 발송 오류\n" + error,
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
  //var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;

  User.findAll()
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
exports.requestDelete = (req, res) => {
  const email = req.params.email;

  const password = req.body.password;
  console.log("pw: ", password);
  if (!password) {
    console.log("!");
    User.update({ leave: "N" }, { where: { email: email } })
      .then(async (data) => {
        console.log("취소 성공: ", data);
        res.status(200).send({ leave: "N", success: true });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({ message: err });
      });
  } else {
    User.findOne({
      where: {
        email: email, // user email
      },
    })
      .then(async (user) => {
        console.log("reqdelete find: ", user);
        const validPassword = await user.validPassword(password, user.password);
        if (validPassword) {
          User.update({ leave: "Y" }, { where: { email: email } })
            .then(async (data) => {
              console.log("success", data);
              res.status(200).send({
                message: "탈퇴 신청을 완료했습니다.",
                success: true,
                leave: "Y",
              });
            })
            .catch((err) => {
              res
                .status(400)
                .send({ message: "탈퇴 신청을 실패했습니다.", error: err });
            });
        } else {
          res.status(400).send({ message: "비밀번호가 틀립니다." });
        }
      })
      .catch((err) => {
        console.log("reqdelete find err: ", err);
      });
  }
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const email = req.params.email;
  console.log("delete email: ", email);
  User.destroy({
    where: { email: email },
  })
    .then((num) => {
      console.log("num: ", num);
      if (num == 1) {
        res.status(200).send({
          success: true,
          message: "User was deleted successfully!",
        });
      } else {
        res.status(200).send({
          success: false,
          message: `Cannot delete User with email=${email}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      console.log("err: ", err);
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
exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log("로그인: ", email, password);
  try {
    User.findOne({
      where: {
        email: email, // user email
      },
    }).then(async (user) => {
      console.log(user);
      if (!user) {
        return res
          .status(200)
          .send({ success: false, message: "User Not found." });
      } else {
        // user 존재
        if (
          !user.dataValues.password ||
          !(await user.validPassword(password, user.dataValues.password))
        ) {
          return res
            .status(200)
            .send({ success: false, message: "비밀번호가 틀립니다." });
        } else {
          // 이메일 인증 완료
          if (user.dataValues.auth === "Y") {
            var token = jwt.sign({ userEmail: user.email }, config.secret, {
              expiresIn: 86400, // 24 hours
            });

            var authorities = [];
            await user.getRoles().then((roles) => {
              for (let i = 0; i < roles.length; i++) {
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
              }
            });

            return res.status(200).send({
              success: true,
              otp: true,
              user: {
                email: user.dataValues.email,
                address: user.dataValues.address,
                id: user.dataValues.id,
                roles: authorities,
                accessToken: token,
                leave: user.dataValues.leave,
                otp: user.dataValues.otp,
              },
            });
          } else {
            return res
              .status(200)
              .send({ success: false, message: "이메일 인증을 완료해주세요." });
          }
        }
      }
    });
  } catch (error) {
    const user = {
      status: 500,
      data: {},
      error: {
        message: "user match failed",
      },
    };
    return res.status(500).send(user);
  }
};

exports.auth = (req, res) => {
  // 페이지 이동 시 마다 인증된 사람인지 토큰 인증된 사람이면 사용자 정보를 다시 넣어줌
  console.log("control ", req.user);
  res.status(200).json({
    //isAdmin: req.user.role === 0 ? false : true,
    isAdmin: req.user.role === "admin" ? true : false,
    isLoggedIn: true,
    email: req.user.email,
    email: req.user.email,
    email: req.user.email,
  });
};
