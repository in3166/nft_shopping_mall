// fileUpload.js
const express = require("express");

const router = express.Router();

const db = require("../models");

const marketplaces = require("../controllers/marketplaces.controller");
const { authJwt } = require("../middleware");

// 판매, 경매 등록
router.post("/", marketplaces.create);

// 모든 업로드 기록 가져오기
router.get("/", marketplaces.findAllOnMarket);
router.get("/all", marketplaces.findAll);
router.get("/myimages/:email", marketplaces.findAllMyImages);
router.get("/:email", authJwt.verifyToken, marketplaces.findOne);
router.get("/goods/:id", marketplaces.findOne);

router.put("/end", marketplaces.endtime);
router.put("/", marketplaces.update);

module.exports = router;
