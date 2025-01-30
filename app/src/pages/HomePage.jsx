import React from 'react';
import HeroSection from '../components/HomePage/HeroSection.jsx';
import FeaturesSection from '../components/HomePage/FeaturesSection.jsx';
import HowItWorksSection from '../components/HomePage/HowItWorksSection.jsx';
import FutureSection from '../components/HomePage/FutureSection.jsx';
import MotivationSection from '../components/HomePage/MotivationSection.jsx';

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FutureSection />
      <MotivationSection />
    </>
  );
};

export default HomePage;
