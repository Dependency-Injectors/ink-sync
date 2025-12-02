import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import type { User } from "../lib/types";
import { PiPlus } from "react-icons/pi";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useCurrentUser } from "../lib/useCurrentUser";

interface UserWithCoowner extends User {
  isCoowner?: boolean;
}
const UserListButton = ({
  users,
  imageId,
}: {
  users: User[];
  imageId: string;
}) => {
  const { user } = useCurrentUser();
  const [visible, setVisible] = useState(false);
  const [imageUsers, setImageUsers] = useState<UserWithCoowner[]>([]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchImageUsers = async () => {
      try {
        const res = await axiosInstance.get(`/images/users/${imageId}`);
        const filteredUsers = users
          .filter((u) => user?.email !== u.email)
          .map((u) => {
            const isCoowner: boolean = res.data.some(
              (iu: User) => iu.id === u.id,
            );
            return { ...u, isCoowner };
          });
        setImageUsers(filteredUsers);
      } catch (error) {
        toast.error("Error fetching image users");
        console.error("Error fetching image users:", error);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    if (visible) {
      fetchImageUsers();
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [imageId, user?.email, users, visible]);

  const handleAddUser = (user: User) => async () => {
    try {
      await axiosInstance.post(`/imageUser`, {
        imageId,
        userEmail: user.email,
      });
      toast.success(`User ${user.email} added to image`);
    } catch (error) {
      toast.error(`Error adding user ${user.email} to image`);
      console.error(`Error adding user ${user.email} to image:`, error);
    } finally {
      setVisible(false);
    }
  };

  const handleRemoveUser = (user: User) => async () => {
    try {
      await axiosInstance.delete(`/imageUser`, {
        data: {
          imageId,
          userEmail: user.email,
        },
      });
      toast.success(`User ${user.email} removed from image`);
    } catch (error) {
      toast.error(`Error removing user ${user.email} from image`);
      console.error(`Error removing user ${user.email} from image:`, error);
    } finally {
      setVisible(false);
    }
  };
  return (
    <>
      <div className="relative inline-block" ref={ref}>
        <button
          onClick={() => setVisible((cur) => !cur)}
          className="flex gap-2 text-petrol-500 hover:text-petrol-400 relative"
        >
          Add User
          <PiPlus size={24} />
        </button>
        {visible && (
          <div className="absolute bg-gray-800 border border-gray-700 mt-2 p-4 shadow-lg rounded w-64">
            <ul className="space-y-2">
              {imageUsers.map((user) => (
                <li key={user.id} className="flex items-center justify-between">
                  <span className="text-white text-sm">{user.email}</span>
                  <button
                    {...(user.isCoowner
                      ? { onClick: handleRemoveUser(user) }
                      : { onClick: handleAddUser(user) })}
                    className="bg-petrol-500 text-white text-xs px-3 py-1 rounded hover:bg-petrol-400 transition"
                  >
                    {user.isCoowner ? "Remove" : "Add"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
export default UserListButton;
