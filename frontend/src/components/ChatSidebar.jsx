import React from "react";

const ChatSidebar = ({
  chats,
  currentChat,
  onSelectChat,
  onlineUsers,
  userId,
  onCreateGroup,
}) => {
  const isUserOnline = (id) => onlineUsers.includes(id);

  return (
    <div className="w-1/4 bg-gray-900 text-white p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chats</h2>
        <button
          className="bg-green-600 text-sm px-2 py-1 rounded hover:bg-green-700"
          onClick={onCreateGroup}
        >
          + Group
        </button>
      </div>
      {chats.map((chat) => {
        const otherUser = chat.isGroup
          ? null
          : chat.members.find((m) => m._id !== userId);
        return (
          <div
            key={chat._id}
            onClick={() => onSelectChat(chat)}
            className={`p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-700 transition ${
              currentChat?._id === chat._id ? "bg-gray-700" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{chat.isGroup ? chat.name : otherUser?.username}</span>
              {!chat.isGroup && isUserOnline(otherUser?._id) && (
                <span className="h-2 w-2 bg-green-400 rounded-full"></span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatSidebar;
