import React, { useEffect, useState } from 'react';

const InformationSection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/accidents');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section id="Information" className="py-16">
      <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary">Latest Accident Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {/* Slice the data array to display only the first 5 items */}
          {data.slice(0, 5).map(item => (
            <Card key={item.id} data={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Card = ({ data }) => {
  const { location, date_time, severity, description } = data;

  return (
    <div className="flex flex-col items-start p-6 bg-secondary shadow-lg rounded-lg">
      <h3 className="text-lg font-semibold text-primary">{location}</h3>
      <p className="text-md text-primary font-semibold">Time: {date_time}</p>
      <p className="text-sm text-secondary">Severity: {severity}</p>
      <p className="text-sm mt-2 text-left">{description}</p>
    </div>
  );
};

export default InformationSection;
