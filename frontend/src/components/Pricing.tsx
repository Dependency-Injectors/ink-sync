import PricingItem from './ui/PricingItem'
import { HiHomeModern } from "react-icons/hi2";
import { FaGraduationCap } from "react-icons/fa";
import { MdFactory } from "react-icons/md";
const Pricing = () => {
  return (
    <div className='flex flex-col py-12 justify-center items-center'>
        <h2 className="text-4xl py-12">Pricing</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-12 justify-items-center items-center gap-8 p-8 w-full">
            {PricingItem("Basic Plan", "Access to basic drawing tools and local storage.", "/", <HiHomeModern size={60} className="text-cyan-400 mb-4" />)}
            <div className="transform scale-y-[1.2]">
              {PricingItem("Pro Plan", "Unlock advanced tools, real-time collaboration, and cloud storage.", "/", <FaGraduationCap size={60} className="text-cyan-400 mb-4" />)}
            </div>
            {PricingItem("Enterprise Plan", "All Pro features plus team management and priority support.", "/", <MdFactory size={60} className="text-cyan-400 mb-4" />)}
        </div>
    </div>
  )
}

export default Pricing