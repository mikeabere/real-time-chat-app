let onlineUsers = new Map();

function initSocket(io) {
  io.on("connection", (socket) => {
    socket.on("setup", (userId) => {
      socket.join(userId);
      onlineUsers[userId] = socket.id;
      io.emit("online-users", Object.keys(onlineUsers));
    });

    socket.on("join-chat", (chatId) => {
      socket.join(chatId);
    });

    socket.on("send-message", (msg) => {
      socket.to(msg.chatId).emit("receive-message", msg);
    });

    socket.on("disconnect", () => {
      for (const [uid, sid] of Object.entries(onlineUsers)) {
        if (sid === socket.id) delete onlineUsers[uid];
      }
      io.emit("online-users", Object.keys(onlineUsers));
    });
  });
}

module.exports = initSocket;
