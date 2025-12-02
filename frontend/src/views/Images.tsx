import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import type { User } from "../lib/types";
import ImageCard from "../components/ui/ImageCard";
import CreateImageForm from "../components/ui/CreateImageForm";
import { AxiosError } from "axios";
import { useCurrentUser } from "../lib/useCurrentUser";
import { useNavigate } from "react-router";

export type Image = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  width: number;
  height: number;
};

const Images = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const { setUser } = useCurrentUser();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await axiosInstance.get("/images");
        setImages(res.data);
      } catch (error) {
        console.log(error instanceof AxiosError);
        if (error instanceof AxiosError && error.response?.status === 401) {
          toast.error("Unauthorized. Please log in.");
          setUser(null);
          navigate("/login");
          return;
        }
        toast.error("Error fetching images");
        console.error("Error fetching images:", error);
      }
    };
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/users");
        setUsers(res.data);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          toast.error("Unauthorized. Please log in.");
          setUser(null);
          navigate("/login");
          return;
        }
        toast.error("Error fetching users");
        console.error("Error fetching users:", error);
      }
    };
    fetchImages();
    fetchUsers();
  }, [navigate, setUser]);
  const createImage = async (formData: FormData) => {
    try {
      const width = Number(formData.get("width"));
      const height = Number(formData.get("height"));
      const res = await axiosInstance.post("/images/", {
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
        <li className="p-4 bg-gray-800 rounded-lg shadow-md text-white flex flex-col gap-2 border-2 border-petrol-600 hover:shadow-petrol-400 hover:shadow-lg transition-shadow">
          <CreateImageForm createImage={createImage} />
        </li>
        {images.map((image) => (
          <ImageCard key={image.id} image={image} users={users} />
        ))}
      </ul>
    </div>
  );
};
export default Images;
