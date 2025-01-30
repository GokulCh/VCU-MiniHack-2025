import React from 'react';

const MotivationSection = () => {
  return (
    <section id="Motivation" className="py-16">
      <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary">Our Motivation</h2>
        <p className="mt-4">
          Our mission is to enhance environmental responsibility, sustainability, and health among users by offering incentives for recycling and exercise. 
        </p>
        </div>
    </section>
  );
};

const Motivation = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center">
      <i className={`${icon} text-2xl`}></i>
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default MotivationSection;
