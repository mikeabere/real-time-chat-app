const express = require("express");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", auth, sendMessage);
router.get("/:chatId", auth, getMessages);

module.exports = router;
