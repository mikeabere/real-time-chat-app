import { useState } from "react";
import api from "../api";

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const handleSearch = async () => {
    const res = await api.get(`/users?search=${search}`);
    setUsers(res.data);
  };

  const handleCreate = async () => {
    const selectedIds = users.filter((u) => u.selected).map((u) => u._id);
    const { data } = await api.post("/chats/group", {
      name: groupName,
      users: selectedIds,
    });
    onGroupCreated(data);
    onClose();
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96 space-y-4">
        <h2 className="text-xl font-bold">Create Group Chat</h2>
        <input
          className="w-full p-2 border rounded"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <input
            className="flex-1 p-2 border rounded"
            placeholder="Search users"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Search
          </button>
        </div>
        <div className="max-h-40 overflow-y-auto space-y-1">
          {users.map((u, i) => (
            <div
              key={u._id}
              className={`p-2 border rounded cursor-pointer ${
                u.selected ? "bg-blue-100" : ""
              }`}
              onClick={() => {
                const updated = [...users];
                updated[i].selected = !updated[i].selected;
                setUsers(updated);
              }}
            >
              {u.username}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="bg-green-500 text-white px-4 py-1 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default CreateGroupModal;
