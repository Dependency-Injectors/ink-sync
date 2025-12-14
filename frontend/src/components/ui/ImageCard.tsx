import type { Image } from "../../views/Images";
import UserListButton from "../UserListButton";
import { BiDoorOpen } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { useState } from "react";

const ImageCard = ({ image, onDelete }: { image: Image; onDelete: (id: string) => void }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/images/${image.id}`);
      toast.success("Image deleted successfully");
      onDelete(image.id);
    } catch (error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 403) {
        toast.error("Only the image owner can delete this image");
      } else if (axiosError.response?.status === 404) {
        toast.error("Image not found");
      } else {
        toast.error("Failed to delete image");
      }
      console.error("Error deleting image:", error);
    } finally {
      setIsDeleting(false);
    }
  };

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
      <div className="flex justify-between items-center mt-auto gap-2">
        <Link
          to={`/draw/${image.id}`}
          className="text-blue-500 hover:text-blue-700 font-medium flex items-center dark:text-petrol-400 dark:hover:text-petrol-200"
        >
          Join Room <BiDoorOpen size={20} className="inline-block ml-1 " />
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 disabled:text-red-300 disabled:cursor-not-allowed dark:text-red-400 dark:hover:text-red-300"
            title="Delete image"
          >
            <MdDelete size={24} />
          </button>
          <UserListButton imageId={image.id} />
        </div>
      </div>
    </li>
  );
};
export default ImageCard;
