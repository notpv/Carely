import React from 'react';

const Footer = () => {
  const funQuote = "The greatest wealth is health.";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 shadow-inner py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-500 dark:text-gray-400 italic">"{funQuote}"</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          &copy; {currentYear} Carely. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
