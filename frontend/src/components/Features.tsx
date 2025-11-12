import FeatureItem from "./ui/FeatureItem"
import { GiPencilBrush  } from "react-icons/gi";
import { TbTools } from "react-icons/tb";
import { FaImage } from "react-icons/fa6";
const Features = () => {
  return (
    <div className="justify-center bg-gray-700 items-center flex flex-col py-12 gap-6 w-full">
        <h2 className="text-4xl">Features</h2>
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-12 justify-items-center gap-8 p-8 w-full">
          {FeatureItem("Real-time Collaboration", "Draw together with friends and colleagues in real-time, no matter where you are.", <GiPencilBrush size={40} />)}
          {FeatureItem("Multiple Tools", "Choose from a variety of drawing tools including pen, brush, and shapes to create your masterpiece.", <TbTools size={40} />)}
          {FeatureItem("Store Locally", "Save your drawings securely on your device.", <FaImage size={40} />)}
           </div>
    </div>
  )
}
 
export default Features