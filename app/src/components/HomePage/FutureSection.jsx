import React from 'react';

const FutureSection = () => {
  return (
    <section id="Future" className="py-16">
      <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary">Future Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          <FutureWork
            icon="bx bx-brain"
            title="AI-Powered Insights"
            description="Use AI to analyze user activity and provide personalized health and environmental recommendations."
          />
          <FutureWork
            icon="bx bx-cloud-upload"
            title="Cloud Expansion"
            description="Scale our platform to support millions of users and provide real-time analytics for global impact."
          />
          <FutureWork
            icon="bx bx-mobile-alt"
            title="Mobile App"
            description="Launch a mobile app for seamless access to fitness tracking, recycling challenges, and rewards."
          />
          <FutureWork
            icon="bx bx-network-chart"
            title="Community Challenges"
            description="Enable users to team up for group challenges, like neighborhood cleanups or tree-planting events."
          />
          <FutureWork
            icon="bx bx-shield-quarter"
            title="Enhanced Security"
            description="Implement advanced security measures to protect user data and ensure privacy."
          />
          <FutureWork
            icon="bx bx-world"
            title="Global Expansion"
            description="Expand Eco Health Quest to new regions, promoting health and sustainability worldwide."
          />
        </div>
      </div>
    </section>
  );
};

const FutureWork = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center">
      <i className={`${icon} text-2xl test-green-500`}></i>
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default FutureSection;
