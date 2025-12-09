import React from 'react';
import { User, Menu } from 'lucide-react';
import type { ViewState } from '../types';

interface NavbarProps {
  onNavigate: (view: ViewState) => void;
  currentPage: ViewState;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 py-4 text-white">
      <div className="container mx-auto px-6">
        <nav className="flex items-center justify-between">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }} 
            className="flex items-center gap-3 group"
          >
            <div className="bg-white rounded-full p-1.5 flex items-center justify-center transform transition-transform group-hover:scale-105">
              <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#111827"/>
                <path d="M12 6C11.45 6 11 6.45 11 7V11H7C6.45 11 6 11.45 6 12C6 12.55 6.45 13 7 13H11V17C11 17.55 11.45 18 12 18C12.55 18 13 17.55 13 17V13H17C17.55 13 18 12.55 18 12C18 11.45 17.55 11 17 11H13V7C13 6.45 12.55 6 12 6Z" fill="#111827" transform="rotate(45 12 12)"/>
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">EVENT <span className="text-primary font-semibold">Xa</span></span>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#" className="relative hover:text-primary transition-colors duration-200 py-2">
              Find My Tickets
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary scale-x-0 transition-transform duration-200 hover:scale-x-100 origin-left"></span>
            </a>
            <button 
              onClick={() => onNavigate('admin_login')}
              className={`hover:text-primary transition-colors duration-200 ${currentPage.startsWith('admin') ? 'text-primary' : ''}`}
            >
              Create an Event
            </button>
            <button 
               onClick={() => onNavigate('admin_login')}
               className="flex items-center gap-2 hover:text-primary transition-colors duration-200"
            >
              <span>Login</span>
              <User size={20} className="stroke-[2.5]" />
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button className="md:hidden text-white hover:text-primary transition-colors">
            <Menu size={28} />
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;