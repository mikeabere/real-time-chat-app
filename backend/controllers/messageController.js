const Message = require("../models/Message");
const Chat = require("../models/Chat");

exports.sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  try {
    const message = await Message.create({
      sender: req.user.id,
      content,
      chatId,
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

    const fullMessage = await message.populate("sender", "username email");
    res.status(201).json(fullMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate("sender", "username email")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
