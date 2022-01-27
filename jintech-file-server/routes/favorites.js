var express = require("express");
var router = express.Router();
const favorite = require("../controllers/favorites.controller");

// Create
router.post("/", favorite.create);
router.get("/:email", favorite.findAll);
router.get("/goods/:email/:marketplaceId", favorite.findOne);

module.exports = router;
