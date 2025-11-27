import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import UserListButton from "../components/UserListButton";
import type { User } from "../lib/types";

type Image = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  width: number;
  height: number;
};

const Images = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axiosInstance.get("/images");
        setImages(res.data);
      } catch (error) {
        toast.error("Error fetching images");
        console.error("Error fetching images:", error);
      }
    };
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        setUsers(res.data);
      } catch (error) {
        toast.error("Error fetching users");
        console.error("Error fetching users:", error);
      }
    };
    fetchImages();
    fetchUsers();
  }, []);
  const createImage = async (formData: FormData) => {
    try {
      const width = Number(formData.get("width"));
      const height = Number(formData.get("height"));
      const res = await axiosInstance.post("/images", {
        width,
        height,
      });
      setImages((prevImages) => [...prevImages, res.data]);
      toast.success("Image created successfully");
      
    } catch (error) {
      toast.error("Error creating image");
      console.error("Error creating image:", error);
      
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto my-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Images</h1>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        <li className="p-4 bg-gray-800 rounded-lg shadow-md text-white flex flex-col gap-4">
          <form
            className="grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              await createImage(formData);
              e.currentTarget.reset();
            }}
          >
            <div className="grid gap-2">
              <label htmlFor="width" className="text-sm font-medium">
                Width
              </label>
              <input
                type="number"
                id="width"
                name="width"
                placeholder="800"
                min={400}
                max={2000}
                required
                className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-petrol-500 disabled:opacity-50 invalid:ring-2 invalid:ring-red-500 focus:invalid:ring-red-500"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="height" className="text-sm font-medium">
                Height
              </label>
              <input
                type="number"
                id="height"
                name="height"
                placeholder="600"
                min={400}
                max={2000}
                required
                className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-petrol-500 disabled:opacity-50 invalid:ring-2 invalid:ring-red-500 focus:invalid:ring-red-500"
              />
            </div>

            <button className="bg-petrol-500 hover:bg-petrol-600 text-white font-semibold py-2 px-4 rounded">
              Create new Image
            </button>
          </form>
        </li>
        {images.map((image) => (
          <li
            key={image.id}
            className="p-4 bg-gray-800 rounded-lg shadow-md text-white flex flex-col gap-2"
          >
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
                className=" text-petrol-500 hover:text-petrol-400 font-medium"
              >
                View Details
              </a>

              <UserListButton users={users} imageId={image.id} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Images;
