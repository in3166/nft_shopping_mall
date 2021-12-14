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

// Update a user with id
router.put("/:email", users.update);

// Delete a Tutorial with id
router.delete("/:email", users.delete);

// delete a all user
router.delete("/", users.deleteAll);

//router.post("/authentication", users.authentication);
router.get("/verify", users.verify);

//router.post("/login", authJwt.isModerator, users.login);
router.post("/login", users.login);

module.exports = router;
