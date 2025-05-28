import React, { useRef, useEffect } from "react";

const MessageList = ({ messages, currentUserId }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-100">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`max-w-lg px-4 py-2 rounded-lg ${
            msg.sender._id === currentUserId
              ? "bg-blue-500 text-white self-end ml-auto"
              : "bg-gray-300 text-gray-900"
          }`}
        >
          <div className="text-sm font-medium">{msg.sender.username}</div>
          <div>{msg.content}</div>
          <div className="text-xs text-right text-white/70 mt-1">
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
