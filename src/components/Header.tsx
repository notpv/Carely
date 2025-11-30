import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Heart, Menu, X, Sparkles } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive 
        ? 'bg-primary text-white shadow-lg shadow-primary/25' 
        : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
      isActive 
        ? 'bg-primary text-white shadow-lg shadow-primary/25' 
        : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`;

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/my-plan', label: 'My Plan' },
    { to: '/meditation', label: 'Meditation', isNew: true },
    { to: '/history', label: 'History' },
    { to: '/progress', label: 'Progress' },
    { to: '/resources', label: 'Resources' },
    { to: '/about', label: 'About' },
  ];

  return (
    <header className="bg-card/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="flex items-center gap-3 group"
            aria-label="Carely Home"
          >
            <Heart className="h-8 w-8 text-primary animate-float group-hover:scale-110 transition-transform duration-200" />
            <span className="text-white text-2xl font-bold font-heading">Carely</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:block" aria-label="Main navigation">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink 
                  key={item.to} 
                  to={item.to} 
                  className={navLinkClass}
                >
                  <span className="flex items-center gap-1">
                    {item.label}
                    {item.isNew && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full uppercase tracking-wide">
                        New
                      </span>
                    )}
                  </span>
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <nav
        id="mobile-menu"
        className={`md:hidden fixed top-16 right-0 w-72 h-[calc(100vh-4rem)] bg-card/98 backdrop-blur-md z-50 transform transition-transform duration-300 ease-out border-l border-white/10 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        <div className="p-4 space-y-2 overflow-y-auto h-full">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={mobileNavLinkClass}
            >
              <span className="flex items-center gap-2">
                {item.label}
                {item.isNew && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full uppercase tracking-wide">
                    New
                  </span>
                )}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
