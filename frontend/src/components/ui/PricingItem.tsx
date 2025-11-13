const PricingItem = (title:string, description:string, link:string, img:React.ReactNode) => {
  return (
   
   <div className="flex flex-col items-center p-6 bg-white/10 border-2 border-cyan-400 rounded-2xl shadow-lg shadow-cyan-400/20 backdrop-blur-md">
   {img}
    <h3 className="text-2xl mb-2">{title}</h3>
    <p className="text-center text-gray-300">{description}</p>
    <a href={link} className="mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow-lg shadow-cyan-500/30">
        Buy now
    </a>
   </div>
  
  )
}

export default PricingItem