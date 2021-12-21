var express = require("express");
var router = express.Router();
const users = require("../controllers/users.controller");
const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// Create
router.post("/", verifySignUp.checkRolesExisted, users.create);

// auth
router.post("/auth", authJwt.verifyToken, users.auth);

// Retrieve all users
router.post("/allUsers", authJwt.isAdmin, users.findAll);

// Retrieve a single user with id
router.get("/user/:email", users.findOne);

//router.post("/login", authJwt.isModerator, users.login);
router.post("/login", users.login);

// Update a user with id
router.put("/:email", users.update);

// 탈퇴 신청, 취소
router.put("/profile/:email", users.requestDelete);

// 탈퇴 승인
router.delete("/:email", authJwt.isAdmin, users.delete);

// delete a all user
router.delete("/", users.deleteAll);

//router.post("/authentication", users.authentication);
router.get("/verify", users.verify);

module.exports = router;
