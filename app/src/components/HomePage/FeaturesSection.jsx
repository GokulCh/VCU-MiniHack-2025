import React from 'react';

const FeaturesSection = () => {
  return (
    <section id="Features" className="py-16">
      <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary">Platform Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          <Feature
            icon="bx bx-bell"
            title="Real-Time Alerts"
            description="Instant notifications about nearby accidents to help drivers avoid potential hazard zones."
          />
          <Feature
            icon="bx bx-shield"
            title="Route Safety"
            description="Suggest alternative routes by cross-referencing current accident and traffic information."
          />
          <Feature
            icon="bx bx-bar-chart-alt-2"
            title="Planning Support"
            description="Provide city officials with detailed accident data to identify and address high-risk areas."
          />
          <Feature
            icon="bx bx-trending-up"
            title="Trend Analysis"
            description="Monitor and report on traffic patterns to support urban traffic management."
          />
          <Feature
            icon="bx bx-history"
            title="Historical Records"
            description="Maintain comprehensive accident records for long-term safety research and urban planning."
          />
          <Feature
            icon="bx bx-lock-alt"
            title="Data Protection"
            description="Ensure user privacy through anonymized data and strict access controls."
          />
        </div>
      </div>
    </section>
  );
};

const Feature = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center">
      <i className={`${icon} text-2xl`}></i>
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default FeaturesSection;
