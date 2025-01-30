import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CRUDSection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newLocation, setNewLocation] = useState({
    street: '',
    intersection: '',
    latitude: '',
    longitude: '',
  });
  const [editingLocation, setEditingLocation] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/locations');
      // Sort locations to show the most recently created one at the top
      const sortedData = response.data.sort((a, b) => b.created_at - a.created_at); // Assuming `created_at` is a timestamp field
      setData(sortedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await axios.post('http://localhost:3001/api/create-location', newLocation);
      fetchData(); // Refresh data after creating
      setNewLocation({ street: '', intersection: '', latitude: '', longitude: '' }); // Reset form
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async () => {
    if (!editingLocation) return;

    try {
      await axios.put(`http://localhost:3001/api/update-location/${editingLocation.location_id}`, editingLocation);
      fetchData(); // Refresh data after update
      setEditingLocation(null); // Reset editing state
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`http://localhost:3001/api/delete-location/${id}`);
      fetchData(); // Refresh data after deletion
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    if (editingLocation) {
      setEditingLocation({ ...editingLocation, [name]: value });
    } else {
      setNewLocation({ ...newLocation, [name]: value });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section id="CRUD" className="crud-section py-16">
      <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-primary">Manage Locations</h2>

        <div className="my-8">
          <h3 className="text-2xl">{editingLocation ? 'Edit Location' : 'Create Location'}</h3>
          <div className="mt-4 space-x-1">
            <input
              type="text"
              name="street"
              placeholder="Street"
              value={editingLocation ? editingLocation.street : newLocation.street}
              onChange={handleChange}
              className="input bg-gray-700 text-white p-2 rounded-md"
            />
            <input
              type="text"
              name="intersection"
              placeholder="Intersection"
              value={editingLocation ? editingLocation.intersection : newLocation.intersection}
              onChange={handleChange}
              className="input bg-gray-700 text-white p-2 rounded-md"
            />
            <input
              type="number"
              name="latitude"
              placeholder="Latitude"
              value={editingLocation ? editingLocation.latitude : newLocation.latitude}
              onChange={handleChange}
              className="input bg-gray-700 text-white p-2 rounded-md"
            />
            <input
              type="number"
              name="longitude"
              placeholder="Longitude"
              value={editingLocation ? editingLocation.longitude : newLocation.longitude}
              onChange={handleChange}
              className="input bg-gray-700 text-white p-2 rounded-md"
            />
          </div>
          <div className="my-4">
            <button onClick={editingLocation ? handleUpdate : handleCreate} className="btn bg-secondary mx-2">
              {editingLocation ? 'Update' : 'Create'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
          {data.map(item => (
            <div key={item.location_id} className="flex flex-col items-start p-6 bg-secondary shadow-lg rounded-lg">
              <h3 className="text-lg font-semibold text-primary">{item.street}</h3>
              <p className="text-md text-primary font-semibold">Intersection: {item.intersection}</p>
              <p className="text-sm text-secondary">Latitude: {item.latitude}</p>
              <p className="text-sm text-secondary">Longitude: {item.longitude}</p>
              <div className="mt-4">
                <button onClick={() => setEditingLocation(item)} className="btn bg-secondary mx-1">
                  <a href="#CRUD"> Edit </a>
                </button>
                <button onClick={() => handleDelete(item.location_id)} className="btn bg-secondary mx-1">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CRUDSection;
