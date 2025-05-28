const express = require("express");
const { createChat, getUserChats } = require("../controllers/chatController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", auth, createChat);
router.get("/", auth, getUserChats);

module.exports = router;
