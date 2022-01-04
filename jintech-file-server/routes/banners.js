// fileUpload.js
const express = require("express");

const router = express.Router();

const db = require("../models");

const banners = require("../controllers/banners.controller");
const { authJwt } = require("../middleware");

// 배너 등록
router.post("/", banners.create);

// 배너 수정
router.put("/", banners.update);

// 모든 배너 가져오기
router.get("/", banners.findAll);

// 모든 배너 가져오기
router.delete("/", banners.delete);

// router.get("/:email", authJwt.verifyToken, categories.findOne);
// router.get("/image", categories.getFile);

module.exports = router;
