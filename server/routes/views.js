var express = require("express");
var router = express.Router();
const views = require("../controllers/views.controller");
const { verifySignUp } = require("../middleware");
const { authJwt } = require("../middleware");

// Create
router.post("/", views.create);

// Retrieve all users
router.post("/allUsers", views.findAll);

router.get("/:marketId", views.count);
router.get("/user/:email", views.findOne);

module.exports = router;
