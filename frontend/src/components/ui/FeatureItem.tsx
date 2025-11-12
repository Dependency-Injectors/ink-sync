const FeatureItem = (title:string, context:string, img:React.ReactNode) => {
  return (
   <div className="flex flex-col items-center p-6 bg-white/10 border-2 border-cyan-400 rounded-2xl shadow-lg shadow-cyan-400/20 backdrop-blur-md">
   {img}
    <h3 className="text-2xl mb-2">{title}</h3>
    <p className="text-center text-gray-300">{context}</p>
   </div>
  )
}

export default FeatureItem