import React from 'react';
import { Search } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-[55vh] md:h-[65vh] flex flex-col items-center justify-center pt-20">
      
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ 
          backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDyV_u_KqTb_o6hP2mbdhFwZHXchb40NDExbBy8FCvFJ-jBdLCpAqUCfW5nCeVqPrevvKJYpAbVWO8szRyVuCmxJ4GYYt2FcsmIP8OYDPRFOG5zcpRC4I4ozbhddWspd4DKz1WcGvCCZ8oBmZNj5Qmch-StzHmtG7tleig79o62QB27nZYRDDNen1kGFIF43nbRmudRADRRs8J9JdUoAPgNMrrwprNPIxYMooBNDZ3D6ofBJ6d1ZGdVuStnnc3uIr45wVnIzRKhcVQ)' 
        }}
      >
        <div className="absolute inset-0 bg-black/40 md:bg-black/50 backdrop-blur-[1px]"></div>
      </div>

   
      <div className="relative container mx-auto px-6 text-center z-10 w-full max-w-2xl">
        <div className="relative transform transition-all hover:scale-[1.01] duration-300">
          <input 
            type="text" 
            placeholder="Search events, artists, venues..." 
            className="w-full pl-6 pr-14 py-4 md:py-5 rounded-full border-0 bg-white/95 text-gray-800 placeholder:text-gray-500 focus:ring-4 focus:ring-primary/30 focus:outline-none transition-all duration-300 shadow-2xl text-base md:text-lg"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white rounded-full p-3 hover:bg-teal-600 transition-colors shadow-md">
            <Search size={22} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
