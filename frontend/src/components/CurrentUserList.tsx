import { useState } from "react";
import type { User } from "../lib/types";
import { BiUser } from "react-icons/bi";

const CurrentUserList = ({ users }: { users: User[] }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="absolute top-0 right-0 m-4 p-4 bg-white bg-opacity-80 rounded-lg shadow-md dark:bg-gray-800 dark:bg-opacity-80">
      <button
        onClick={() => setVisible(!visible)}
        className="bg-petrol-500 hover:bg-petrol-400 text-white font-semibold py-2 px-4 rounded"
      >
        <BiUser className="inline mr-2" />
        {users.length} User{users.length !== 1 ? "s" : ""}
      </button>
      {visible && (
        <ul className="mt-4 space-y-2">
          {users.map((user) => (
            <li key={user.id} className="text-black dark:text-white not-last:border-b not-last:border-gray-300 not-last:pb-2">
              {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default CurrentUserList;
