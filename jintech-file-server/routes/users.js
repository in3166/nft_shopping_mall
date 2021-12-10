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

// Retrieve all users
router.get("/", users.findAll);

// Retrieve a single user with id
router.get("/email/:email", users.findOne);

// Update a user with id
router.put("/:email", users.update);

// Delete a Tutorial with id
router.delete("/:email", users.delete);

// delete a all user
router.delete("/", users.deleteAll);

//router.post("/authentication", users.authentication);
router.get("/verify", users.verify);

//router.post("/login", authJwt.isModerator, users.login);
router.post("/login", [authJwt.verifyToken],  users.login);

module.exports = router;
