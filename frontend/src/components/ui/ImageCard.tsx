import type { Image } from "../../views/Images";
import UserListButton from "../UserListButton";
import { BiDoorOpen } from "react-icons/bi";

const ImageCard = ({ image }: { image: Image }) => {
  return (
    <li className="p-4 bg-white rounded-lg shadow-md text-black flex flex-col gap-2 border-2 border-gray-200 hover:shadow-lg transition-shadow dark:p-4 dark:bg-gray-800 dark:rounded-lg dark:shadow-md dark:text-white dark:flex dark:flex-col dark:gap-2 dark:border-2 dark:border-petrol-600 dark:hover:shadow-petrol-400 dark:hover:shadow-lg dark:transition-shadow">
      <div className="text-lg font-semibold">Image ID: {image.id}</div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Dimensions: {image.width}px x {image.height}px
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Created: {new Date(image.createdAt).toLocaleString()}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        Last edited: {new Date(image.updatedAt).toLocaleString()}
      </div>
      <div className="flex justify-between items-center mt-auto">
        <a
          href={`/draw/${image.id}`}
          className="text-blue-500 hover:text-blue-700 font-medium flex items-center dark:text-petrol-400 dark:hover:text-petrol-200"
        >
          Join Room <BiDoorOpen size={20} className="inline-block ml-1 " />
        </a>

        <UserListButton imageId={image.id} />
      </div>
    </li>
  );
};
export default ImageCard;
