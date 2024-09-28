"use client";
import Image from 'next/image';
import './main.css';
import graph from "../../../public/graph.jpg"
import piechart from "../../../public/piechart.avif"
import employe from "../../../public/employe.avif"

const Page = () => {
  return (
    <div className="page-container px-20 p-20 py-32 flex justify-between">
      {/* Left paragraph */}
      <div className="text-content flex gap-4 w-1/3 flex-col custom-line-height relative">
        <p className=' text-4xl font-bold'>
          Revolutionize Your Email Marketing Strategies
        </p>

        {/* Red curved line below paragraph */}
        <svg 
          className="curved-line absolute bottom-56 -left-10" // Adjusted position to be closer to the paragraph
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 300 40" 
          width="100%" 
          height="49"
          preserveAspectRatio="none"
        >
          <path d="M10,30 Q150,0 290,30" stroke="#ec6868" strokeWidth="4" fill="none" />
        </svg>

        {/* Add margin to the following paragraph */}
        <p className="mt-10 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum nostrum temporibus provident aliquid accusamus suscipit omnis facere quis, veritatis quibusdam repellendus minima. Repudiandae, modi quisquam. Quis sint in temporibus, consequatur amet voluptas, error dolore perferendis eveniet molestias, vel id assumenda. Sapiente est pariatur velit enim unde, sint accusamus maxime quaerat!
        </p>
        <button className=' p-2 rounded-full mt-5 font-bold text-white bg-red-400'>TRY IT NOW</button>
      </div>

      {/* Right side section with heptagons and boxes */}
      <div className="heptagon-container w-1/2 relative">
        {/* Red heptagon */}
        <div className="heptagon red-heptagon"></div>
        {/* Black heptagon */}
        <div className="heptagon black-heptagon"></div>

        {/* Box 1 - Overview */}
        <div className="box overview-box">
          <div className='justify-between flex'>
            <p className='text-xs font-bold'>Overview</p>
            <p className='text-xs p-1 bg-red-400 px-2 rounded-full text-white flex justify-center items-center'>monthly</p>
          </div>
          <Image src={graph} alt='graph' className='mt-3'/>
        </div>

        {/* Box 2 - Audience */}
        <div className="box audience-box flex flex-col justify-center items-center">
          <p className='font-bold'>Our Audience</p>
          <Image src={piechart} alt='pie' className='mt-3'/>
        </div>

        {/* Box 3 - Employees */}
        <div className="box flex flex-col justify-center items-center employees-box">
          <p className='font-bold'>Employees</p>
          <Image alt='employe' src={employe} className='mt-4'/>
        </div>
      </div>
    </div>
  );
};

export default Page;
