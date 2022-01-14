// fileUpload.js
const express = require("express");

const router = express.Router();

const db = require("../models");

const marketHistories = require("../controllers/marketHistories.controller");
const { authJwt } = require("../middleware");

// 판매, 경매 등록
router.post("/", marketHistories.create);

// 모든 업로드 기록 가져오기
router.get("/sales", marketHistories.findAllSales);
router.get("/:id", marketHistories.findAll);
// router.get("/:email", authJwt.verifyToken, marketHistories.findOne);
router.get("/goods/:id", marketHistories.findOne);

router.put("/", marketHistories.update);

module.exports = router;
