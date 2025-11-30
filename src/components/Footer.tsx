import React, { useState, useEffect } from 'react';
import { ArrowUp, Heart, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = [
    { to: '/my-plan', label: 'My Plan' },
    { to: '/progress', label: 'Progress' },
    { to: '/resources', label: 'Resources' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 p-3 rounded-full bg-primary text-white shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background z-50 ${
          showScrollTop 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>

      <footer className="bg-card/95 backdrop-blur-md shadow-inner py-8 mt-12 text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="flex flex-col items-center md:items-start">
              <Link to="/" className="flex items-center gap-2 mb-4 group">
                <Heart className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xl font-bold font-heading">Carely</span>
              </Link>
              <p className="text-gray-400 text-sm text-center md:text-left max-w-xs">
                Your AI-powered personal health advisor. Get personalized wellness plans tailored to your unique needs.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center">
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <nav className="flex flex-wrap justify-center gap-4">
                {footerLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-gray-400 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Quote Section */}
            <div className="flex flex-col items-center md:items-end">
              <p className="italic text-gray-400 text-sm text-center md:text-right">
                "The greatest wealth is health."
              </p>
              <p className="text-gray-500 text-xs mt-2">— Virgil</p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} Carely. All Rights Reserved.
            </p>
            <p className="text-xs text-gray-500">
              Made with <Heart className="inline w-3 h-3 text-red-500 mx-1" /> for better health
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
