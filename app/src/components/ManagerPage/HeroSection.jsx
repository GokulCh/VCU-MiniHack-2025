import React from 'react';

const HeroSection = () => {
  return (
    <section id="Home" className="w-full flex flex-col items-center justify-center py-24 sm:py-36 h-screen relative">
      <div id="HeroSectionContainer" className="flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold fade-in-medium">
          <span className="text-blue-500">SmartCity</span> <span className="text-white">Manager Portal</span>
        </h1>
        <p className="text-base max-w-3xl mx-auto">
          Welcome to the Manager Portal. Here you can perform CRUD operations on our database. We encourage open-source
          collaboration—everyone is welcome to contribute and improve our system.
        </p>
      </div>

      <div id="HeroSectionScrollDownArrow" className="absolute bottom-10 text-center">
        <i className="bx bx-chevron-down text-white text-3xl animate-bounce"></i>
      </div>
    </section>
  );
};

export default HeroSection;
