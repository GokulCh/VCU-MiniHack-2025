import React from 'react';

const HowItWorksSection = () => {
  return (
    <section id="HowItWorks" className="py-16">
      <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-primary text-3xl">How Eco Health Quest Works</h2>
        <p className="mt-4">
        A fun and impactful way to improve your health and the planet through fitness and environmental challenges.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8">
          <Process
            icon="bx bx-run"
            title="Track Your Activities"
            description="Use GPS and motion tracking to log your walking, running, or biking activities and earn points."
          />
          <Process
            icon="bx bx-recycle"
            title="Complete Recycling Challenges"
            description="Submit photos of recyclable trash/ recycling bins and earn points/rewards."
          />
          <Process
             icon="bx bx-leaf"
             title="Support Green Initiatives"
             description="Donate your points to environmental causes or redeem them for discounts and rewards."
          />
        </div>
      </div>
    </section>
  );
};

const Process = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center">
      <i className={`${icon} text-2xl test-green-500`}></i>
      <h3 className="text-lg font-semibold text-green-500">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default HowItWorksSection;
