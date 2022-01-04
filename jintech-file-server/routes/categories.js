// fileUpload.js
const express = require("express");

const router = express.Router();

const db = require("../models");

const categories = require("../controllers/categories.controller");
const { authJwt } = require("../middleware");

// 카테고리 등록
router.post("/", categories.create);

// 카테고리 수정
router.put("/", categories.update);

// 모든 카테고리 가져오기
router.get("/", categories.findAll);

// 모든 카테고리 가져오기
router.delete("/", categories.delete);

// router.get("/:email", authJwt.verifyToken, categories.findOne);
// router.get("/image", categories.getFile);

module.exports = router;
