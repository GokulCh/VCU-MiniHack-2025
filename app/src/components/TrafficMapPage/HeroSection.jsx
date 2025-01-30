import React from 'react';

const HeroSection = () => {
  return (
    <section id="Home" className="w-full flex flex-col items-center justify-center py-24 sm:py-36 h-screen relative">
      <div id="HeroSectionContainer" className="flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold fade-in-medium">
          <span className="text-green-500">EcoHealth</span> <span className="text-white">Trash Traffic Map</span>
        </h1>
        <p className="text-base max-w-3xl mx-auto">
          View the live <span className="text-green-500 font-semibold">Trash Interactivity Rate</span> in your city. 
          Track real-time litter collection efforts and see the impact of your environmental actions.
        </p>
      </div>

      <div id="HeroSectionScrollDownArrow" className="absolute bottom-10 text-center">
        <i className="bx bx-chevron-down text-white text-3xl animate-bounce"></i>
      </div>
    </section>
  );
};

export default HeroSection;
