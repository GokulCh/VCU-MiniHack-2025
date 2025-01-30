import React from 'react';

const FeaturesSection = () => {
  return (
    <section id="Features" className="py-16">
      <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary">Platform Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          <Feature
            icon="bx bx-dollar-circle"
            title="Financial Incentive"
            description="Earn money by helping the environment."
          />
          <Feature
            icon="bx bx-trending-up"
            title="Trend Analysis"
            description="Stay motivated and track your progress effortlessly with our app's advanced fitness history features."
          />
          <Feature
            icon="bx bx-recycle"
            title="Donations"
            description="Turn earned points into donations to environmental organizations."
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
