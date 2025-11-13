import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Header = () => {
  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between h-16 w-full">
                    <div className="flex items-center">
                      <NavLink to="/" className="flex-shrink-0 flex items-center gap-3">
                        <Heart className="h-8 w-8 text-primary animate-float" />
                        <span className="text-white text-2xl font-bold font-heading">Carely</span>
                      </NavLink>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-auto flex items-baseline space-x-4">
                        <NavLink to="/" className={navLinkClass}>Home</NavLink>
                        <NavLink to="/my-plan" className={navLinkClass}>My Plan</NavLink>
                        <NavLink to="/history" className={navLinkClass}>History</NavLink>
                        <NavLink to="/progress" className={navLinkClass}>Progress</NavLink>
                        <NavLink to="/resources" className={navLinkClass}>Resources</NavLink>
                        <NavLink to="/about" className={navLinkClass}>About</NavLink>
                      </div>
                    </div>
                  </div>      </div>
    </header>
  );
};

export default Header;
