import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1F2937] text-gray-400 py-8 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm hover:text-white transition-colors duration-200">About Us</a>
            <a href="#" className="text-sm hover:text-white transition-colors duration-200">Help Center</a>
            <a href="#" className="text-sm hover:text-white transition-colors duration-200">Terms</a>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white hover:scale-110 transition-all duration-200">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-white hover:scale-110 transition-all duration-200">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-white hover:scale-110 transition-all duration-200">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-white hover:scale-110 transition-all duration-200">
              <Youtube size={20} />
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-600">
            &copy; {new Date().getFullYear()} EVENT Xa. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
