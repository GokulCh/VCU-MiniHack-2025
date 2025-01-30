import React from 'react';

const GetStartedSection = () => {
  return (
    <section id="GetStarted">
      <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary">Get Started with Smart City Traffic Hub</h2>
        <p className="mt-4">
          Follow these simple steps to start using our platform and make your urban commute safer and more efficient.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
          <Step
            icon="bx bx-user-plus"
            title="Sign Up"
            description="Create an account to access personalized traffic updates and safety alerts."
          />
          <Step
            icon="bx bx-map-pin"
            title="Set Your Preferences"
            description="Customize your alert preferences and set your frequently traveled routes."
          />
          <Step
            icon="bx bx-bell"
            title="Stay Informed"
            description="Receive real-time notifications about accidents and traffic conditions on your routes."
          />
        </div>
      </div>
    </section>
  );
};

const Step = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center">
      <i className={`${icon} text-2xl`}></i>
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default GetStartedSection;
