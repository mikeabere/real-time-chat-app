import { useEffect, useState } from "react";
import api from "../api";
import socket from "../socket";
import base64 from "base-64";
import CreateGroupModal from "../components/CreateGroupModal";
//import ChatSidebar from "../components/ChatSidebar";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { parseJWT }  from "../utils/jwt";



const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const token = localStorage.getItem("token");
  const user = parseJWT(token);

  useEffect(() => {
    socket.connect();
    socket.emit("setup", user.id);
    socket.on("online-users", setOnlineUsers);
    api.get("/chats").then((res) => setChats(res.data));
  }, []);

  useEffect(() => {
    if (!currentChat) return;
    socket.emit("join-chat", currentChat._id);
    api
      .get(`/messages/${currentChat._id}`)
      .then((res) => setMessages(res.data));
    socket.on("receive-message", (msg) => {
      if (msg.chatId === currentChat._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => socket.off("receive-message");
  }, [currentChat]);

  useEffect(() => {
    const userId = JSON.parse(
      base64.decode(localStorage.getItem("token").split(".")[1])
    ).id;
    socket.connect();
    socket.emit("setup", userId);
    api.get("/chats").then((res) => setChats(res.data));
  }, []);

  useEffect(() => {
    if (!currentChat) return;

    socket.emit("join-chat", currentChat._id);
    api
      .get(`/messages/${currentChat._id}`)
      .then((res) => setMessages(res.data));

    socket.on("receive-message", (msg) => {
      if (msg.chatId === currentChat._id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => socket.off("receive-message");
  }, [currentChat]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    const { data } = await api.post("/messages", {
      chatId: currentChat._id,
      content: newMsg,
    });
    socket.emit("send-message", data);
    setMessages((prev) => [...prev, data]);
    setNewMsg("");
  };

  const isUserOnline = (id) => onlineUsers.includes(id);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-900 text-white p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <button
          className="bg-green-600 text-sm px-2 py-1 rounded hover:bg-green-700"
          onClick={() => setShowModal(true)}
        >
          + Group
        </button>
        {chats.map((chat) => {
          const otherUser = chat.isGroup
            ? null
            : chat.members.find((m) => m._id !== user.id);
          return (
            <div
              key={chat._id}
              onClick={() => setCurrentChat(chat)}
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
      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {currentChat ? (
          <>
            <div className="p-4 bg-white shadow text-lg font-semibold border-b">
              {currentChat.isGroup
                ? currentChat.name
                : currentChat.members.find((m) => m._id !== user.id)?.username}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-lg px-4 py-2 rounded-lg ${
                    msg.sender._id === user.id
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-gray-300 text-gray-900"
                  }`}
                >
                  <div className="text-sm font-medium">
                    {msg.sender.username}
                  </div>
                  <div>{msg.content}</div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t bg-white flex items-center gap-2">
              <input
                className="flex-1 px-4 py-2 border rounded-lg outline-none focus:ring focus:ring-blue-300"
                placeholder="Type your message..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
      <CreateGroupModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onGroupCreated={(group) => setChats((prev) => [group, ...prev])}
      />
      {/* <ChatSidebar
        chats={chats}
        currentChat={currentChat}
        onSelectChat={setCurrentChat}
        onlineUsers={onlineUsers}
        userId={user.id}
        onCreateGroup={() => setShowModal(true)}
      /> */}
      ...
      {/* <MessageList messages={messages} currentUserId={user.id} /> */}
      <MessageInput
        newMsg={newMsg}
        setNewMsg={setNewMsg}
        onSend={sendMessage}
      />
    </div>
  );
};

export default ChatPage;
