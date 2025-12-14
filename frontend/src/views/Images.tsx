import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import ImageCard from "../components/ui/ImageCard";
import CreateImageForm from "../components/ui/CreateImageForm";
import { AxiosError } from "axios";
import { useCurrentUser } from "../lib/useCurrentUser";
import { useNavigate } from "react-router";

export type Image = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  width: number;
  height: number;
};

const Images = () => {
  const [images, setImages] = useState<Image[]>([]);
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

    fetchImages();
  }, [navigate, setUser]);

  const createImage = async (formData: FormData) => {
    try {
      const width = Number(formData.get("width"));
      const height = Number(formData.get("height"));
      const title = formData.get("title");
      const res = await axiosInstance.post("/images/", {
        width,
        height,
        title,
      });
      setImages((prevImages) => [...prevImages, res.data]);
      toast.success("Image created successfully");
    } catch (error) {
      toast.error("Error creating image");
      console.error("Error creating image:", error);
    }
  };

  const handleDeleteImage = (imageId: string) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
  };

  return (
    <div className="max-w-[1200px] mx-auto my-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Images</h1>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        <li className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md text-gray-500 dark:rounded-lg dark:text-white  flex-col gap-2 border-2 border-petrol-600 hover:shadow-black/30 dark:hover:shadow-petrol-400 hover:shadow-lg transition-shadow">
          <CreateImageForm createImage={createImage} />
        </li>
        {images.map((image) => (
          <ImageCard key={image.id} image={image} onDelete={handleDeleteImage} />
        ))}
      </ul>
    </div>
  );
};
export default Images;
