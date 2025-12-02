import type { User } from "../../lib/types";
import type { Image } from "../../views/Images";
import UserListButton from "../UserListButton";
import { BiDoorOpen } from "react-icons/bi";

const ImageCard = ({ image, users }: { image: Image; users: User[] }) => {
  return (
    <li className="p-4 bg-gray-800 rounded-lg shadow-md text-white flex flex-col gap-2 border-2 border-petrol-600 hover:shadow-petrol-400 hover:shadow-lg transition-shadow">
      <div className="text-lg font-semibold">Image ID: {image.id}</div>
      <div className="text-sm text-gray-400">
        Dimensions: {image.width}px x {image.height}px
      </div>
      <div className="text-sm text-gray-400">
        Created: {new Date(image.createdAt).toLocaleString()}
      </div>
      <div className="text-sm text-gray-400">
        Last edited: {new Date(image.updatedAt).toLocaleString()}
      </div>
      <div className="flex justify-between items-center mt-auto">
        <a
          href={`/draw/${image.id}`}
          className=" text-petrol-400 hover:text-petrol-200 font-medium flex items-center"
        >
          Join Room <BiDoorOpen size={20} className="inline-block ml-1 " />
        </a>

        <UserListButton users={users} imageId={image.id} />
      </div>
    </li>
  );
};
export default ImageCard;
