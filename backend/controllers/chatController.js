const Chat = require("../models/Chat");

exports.createChat = async (req, res) => {
  const { members, isGroup, name } = req.body;
  try {
    const chat = await Chat.create({
      name,
      isGroup,
      members: [...members, req.user.id],
    });
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ members: req.user.id })
      .populate("members", "username email")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
