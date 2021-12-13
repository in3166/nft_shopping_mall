const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.users;

verifyToken = (req, res, next) => {
  let token = req.body.token;
  console.log("ver token", token);
  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.body.userEmail = decoded.userEmail;

    await User.findOne({ where: { email: decoded.userEmail } })
      .then(async (user) => {
        console.log("user: ", user.dataValues);
        req.user = user.dataValues;
        await user.getRoles().then((roles) => {
          req.user.role = roles[0].name;
          console.log("role", roles);
        });
      })
      .catch((err) => {
        console.log("find err: ", err);
        res.status(400).send({ message: err });
      });

    req.token = token;
    // req.user = user
    //console.log("decoded: ", decoded);
    //console.log("req body: ", req.body);
    next();
  });
};

isAdmin = (req, res, next) => {

  const email = JSON.parse(req.body.token).email;
  User.findOne({ where: { email: email } })
    .then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({
          message: "Require Admin Role!",
        });
        return;
      });
    })
    .catch((err) => {
      console.log("isAdmin find err: ", err);
    });
};

isModerator = (req, res, next) => {
  console.log("req.body: ", req.body);
  User.findOne({ where: { email: req.body.email } }).then((user) => {
    console.log("!!!!!!!?:", user);
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }
      console.log("Require Moderator Role!");
      res.status(403).send({
        message: "Require Moderator Role!",
      });
    });
  });
};

// isModeratorOrAdmin = (req, res, next) => {
//   User.findByPk(req.userId).then(user => {
//     user.getRoles().then(roles => {
//       for (let i = 0; i < roles.length; i++) {
//         if (roles[i].name === "moderator") {
//           next();
//           return;
//         }

//         if (roles[i].name === "admin") {
//           next();
//           return;
//         }
//       }

//       res.status(403).send({
//         message: "Require Moderator or Admin Role!"
//       });
//     });
//   });
// };

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  //   isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;
