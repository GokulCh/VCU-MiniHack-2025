import React from 'react';

const FutureSection = () => {
  return (
    <section id="Future" className="py-16">
      <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary">Future Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          <FutureWork
            icon="bx bx-brain"
            title="AI Integration"
            description="Implement AI algorithms to predict traffic patterns and potential accident hotspots."
          />
          <FutureWork
            icon="bx bx-cloud-upload"
            title="Cloud Expansion"
            description="Expand cloud infrastructure to handle increased data volume and provide real-time analytics."
          />
          <FutureWork
            icon="bx bx-mobile-alt"
            title="Mobile App"
            description="Develop a mobile application to provide users with on-the-go access to traffic updates and alerts."
          />
          <FutureWork
            icon="bx bx-network-chart"
            title="IoT Integration"
            description="Integrate with IoT devices for real-time data collection and enhanced traffic monitoring."
          />
          <FutureWork
            icon="bx bx-shield-quarter"
            title="Enhanced Security"
            description="Implement advanced security measures to protect user data and ensure privacy."
          />
          <FutureWork
            icon="bx bx-world"
            title="Global Expansion"
            description="Expand the platform to support multiple cities and provide a global traffic monitoring solution."
          />
        </div>
      </div>
    </section>
  );
};

const FutureWork = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center">
      <i className={`${icon} text-2xl`}></i>
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default FutureSection;
