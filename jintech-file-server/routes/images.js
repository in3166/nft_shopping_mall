// fileUpload.js
const express = require("express");

const router = express.Router();

const db = require("../models");

const images = require("../controllers/images.controller");
const { authJwt } = require("../middleware");

// 판매, 경매 등록
router.post("/", images.create);

// 모든 업로드 기록 가져오기
router.get("/", authJwt.isAdmin, images.findAll);
router.get("/:email", authJwt.verifyToken, images.findOne);
router.get("/goods/:id", images.getFile);

router.put("/", images.update);

module.exports = router;
