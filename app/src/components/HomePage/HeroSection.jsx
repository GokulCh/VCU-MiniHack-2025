import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    name: 'Fitness Tracking',
    description: 'Track your walking, running, and biking activities to earn points and unlock quests.',
    icon: 'bx bx-run', // Icon for fitness
  },
  {
    name: 'Recycling Challenges',
    description: 'Take photos of recyclable trash and recycling bins to complete challenges and earn rewards.',
    icon: 'bx bx-recycle', // Icon for recycling
  },
  {
    name: 'Green Initiatives',
    description: 'Donate your points to support environmental causes or redeem them for discounts and rewards.',
    icon: 'bx bx-leaf',
  },
];

const HeroSection = () => {
  return (
    <section id="Home" className="w-full flex flex-col items-center justify-center py-24 sm:py-36 h-screen relative">
      <div id="HeroSectionContainer" className="flex flex-col items-center justify-center text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold fade-in-medium">
          <span className="text-green-500">Eco Health</span> <span className="text-white">Quest</span>
        </h1>
        <p className="text-base max-w-3xl mx-auto">
        Improve your health and the planet through real-world activities. Complete fitness and environmental challenges to earn rewards and make a difference.
        </p>
      </div>

      <div
        id="HeroSectionFeatures"
        className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 max-w-5xl mx-auto m-5"
      >
        {features.map(feature => (
          <div key={feature.name} className="flex flex-col items-center text-center float">
            <i className={`${feature.icon} text-2xl`}></i>
            <span className="text-lg font-semibold text-primary">{feature.name}</span>
            <p className="text-sm max-w-xs sm:max-w-md mx-auto break-words">{feature.description}</p>
          </div>
        ))}
      </div>

      <div id="HeroSectionGetStartedButton" className="mt-10">
        <Link to="/QuestMap">
          <button
            className="btn btn-primary text-white bg-gradient-to-r from-green-500 to-green-700 p-2 px-3 rounded-3xl shadow-lg mx-4 
      transition-all duration-300 hover:from-green-400 hover:to-green-600"
          >
            Get Started
          </button>
        </Link>
      </div>

      <div id="HeroSectionScrollDownArrow" className="absolute bottom-10 text-center">
        <i className="bx bx-chevron-down text-white text-3xl animate-bounce"></i>
      </div>
    </section>
  );
};

export default HeroSection;
