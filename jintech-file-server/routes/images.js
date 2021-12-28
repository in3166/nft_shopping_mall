// fileUpload.js
const express = require("express");

const router = express.Router();

const db = require("../models");

const images = require("../controllers/images.controller");

// 판매, 경매 등록
router.post("/", images.create);

// 모든 업로드 기록 가져오기
router.get("/", images.findAll);
router.get("/image", images.getFile);


module.exports = router;
