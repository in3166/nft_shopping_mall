var express = require('express');
var router = express.Router();
const users = require("../controllers/users.controller");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// Create a new Tutorial
router.post("/", users.create);

// Retrieve all Tutorials
router.get("/", users.findAll);


// Retrieve a single Tutorial with id
router.get("/email/:email", users.findOne);

// Update a Tutorial with id
router.put("/:email", users.update);

// Delete a Tutorial with id
router.delete("/:email", users.delete);

// Create a new Tutorial
router.delete("/", users.deleteAll);


//router.post("/authentication", users.authentication);
router.get("/verify", users.verify);

router.post("/login", users.login)

module.exports = router;
