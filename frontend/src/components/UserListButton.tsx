import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import type { User } from "../lib/types";
import { PiPlus } from "react-icons/pi";
import { useState } from "react";

const UserListButton = ({ users, imageId }: { users: User[]; imageId: string }) => {
  const [visible, setVisible] = useState(false);
  const handleAddUser = (user: User) => async () => {
    try {
      await axiosInstance.post(`/${imageId}/${user.id}/coown`, {
        user,
      });
      toast.success(`User ${user.email} added to image`);
    } catch (error) {
      toast.error(`Error adding user ${user.email} to image`);
      console.error(`Error adding user ${user.email} to image:`, error);
    }
  };
  return (
    <>
      <button
        onClick={() => setVisible((cur) => !cur)}
        className="flex gap-2 text-petrol-500 hover:text-petrol-400"
      >
        Add User
        <PiPlus size={24} />
      </button>
      {visible && (
        <div className="absolute bg-gray-800 border border-gray-700 mt-2 p-4 shadow-lg rounded w-64">
          <ul className="space-y-2">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between">
          <span className="text-white text-sm">{user.email}</span>
          <button
            onClick={handleAddUser(user)}
            className="bg-petrol-500 text-white text-xs px-3 py-1 rounded hover:bg-petrol-400 transition"
          >
            Add
          </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
export default UserListButton;
