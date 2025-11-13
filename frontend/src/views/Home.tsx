import Features from "../components/Features";
import Hero from "../components/Hero";
import Pricing from "../components/Pricing";

const Home = () => {
  return (
    <>
      <div className=" bg-gray-950 text-white flex flex-col justify-center ">
        <Hero />
        <Features />
        <Pricing />
      </div>
    </>
  );
};
export default Home;
