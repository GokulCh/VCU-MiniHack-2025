import React from 'react';

const MotivationSection = () => {
  return (
    <section id="Motivation" className="py-16">
      <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary">Our Motivation</h2>
        <p className="mt-4">
          Our mission is to enhance urban mobility and safety by providing real-time traffic updates and data-driven
          insights.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          <Motivation
            icon="bx bx-heart"
            title="Community Safety"
            description="We aim to reduce accidents and improve road safety for everyone."
          />
          <Motivation
            icon="bx bx-bar-chart"
            title="Data-Driven Insights"
            description="Leveraging data to make informed decisions and improve urban planning."
          />
          <Motivation
            icon="bx bx-globe"
            title="Global Impact"
            description="Expanding our reach to create safer cities worldwide."
          />
        </div>
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
