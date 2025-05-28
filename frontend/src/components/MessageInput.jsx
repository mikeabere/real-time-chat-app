import React from "react";

const MessageInput = ({ newMsg, setNewMsg, onSend }) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && newMsg.trim()) {
      onSend();
    }
  };

  return (
    <div className="p-4 border-t bg-white flex items-center gap-2">
      <input
        className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring focus:ring-blue-300"
        placeholder="Type your message..."
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        onClick={onSend}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
