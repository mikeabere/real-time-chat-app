const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    name: { type: String },
    isGroup: { type: Boolean, default: false },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
