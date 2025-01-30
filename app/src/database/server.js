import express from 'express';
import cors from 'cors';

// Importing query files
import * as distinctQueries from './queries/distinctQueries.js';
import { Locations } from './queries/locationsDb.js';
import { Users } from './queries/usersDb.js';
import { Accidents } from './queries/accidentDb.js';
import { EmergencyServices } from './queries/emergencyServicesDb.js';
import { UserAccidents } from './queries/userAccidentsDb.js';

// Initialize app and port
const app = express();
const port = 3001;

// Middleware setup
app.use(cors()); // Enable CORS
app.use(express.json());

// Haversine formula to calculate the distance between two points on the Earth
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

// API to fetch all query names
app.get('/api/query', (req, res) => {
  const queryNames = Object.keys(distinctQueries);
  res.json({ message: "Valid API's", queryNames });
});

// New route to get closest locations based on coordinates (lat, lng)
app.get('/api/locations', async (req, res) => {
  const { lat, lng } = req.query;

  try {
    const locations = await new Locations().getAllLocations();

    // If lat and lng are provided, calculate the distance and sort the locations
    if (lat && lng) {
      const sortedLocations = locations
        .map(location => ({
          ...location,
          distance: calculateDistance(lat, lng, location.lat, location.lng),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10); // Take the closest 10 locations

      res.json(sortedLocations);
    } else {
      // If lat and lng are not provided, return all locations
      res.json(locations);
    }
  } catch (err) {
    console.error('Error fetching locations:', err);
    res.status(500).send('Error fetching locations');
  }
});

// Route to get location by ID
app.get('/api/locations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const location = await new Locations().getLocationById(id);
    if (!location) {
      return res.status(404).send('Location not found');
    }
    res.json(location);
  } catch (err) {
    console.error('Error fetching location:', err);
    res.status(500).send('Error fetching location');
  }
});

// Create a new location
app.post('/api/create-location', async (req, res) => {
  try {
    const locationData = req.body;

    // Validate required fields
    if (!locationData.street || !locationData.intersection) {
      return res.status(400).send('Street and intersection are required');
    }

    const newLocationId = await new Locations().createLocation(locationData);

    // Fetch the newly created location to return it
    const newLocation = await new Locations().getLocationById(newLocationId);

    res.status(201).json(newLocation);
  } catch (err) {
    console.error('Error creating location:', err);
    res.status(500).send('Error creating location');
  }
});

// Update an existing location
app.put('/api/update-location/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const locationData = req.body;

    // Validate required fields
    if (!locationData.street || !locationData.intersection) {
      return res.status(400).send('Street and intersection are required');
    }

    const affectedRows = await new Locations().updateLocation(id, locationData);

    if (affectedRows === 0) {
      return res.status(404).send('Location not found');
    }

    // Fetch the updated location to return it
    const updatedLocation = await new Locations().getLocationById(id);

    res.json(updatedLocation);
  } catch (err) {
    console.error('Error updating location:', err);
    res.status(500).send('Error updating location');
  }
});

// Delete a location
app.delete('/api/delete-location/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await new Locations().deleteLocation(id);

    if (affectedRows === 0) {
      return res.status(404).send('Location not found');
    }

    res.status(200).send('Location deleted successfully');
  } catch (err) {
    console.error('Error deleting location:', err);
    res.status(500).send('Error deleting location');
  }
});

// API routes for fetching data
const fetchData = (model, errorMessage, res) => {
  model()
    .then(data => res.json(data))
    .catch(err => {
      console.error(errorMessage, err);
      res.status(500).send(errorMessage);
    });
};

app.get('/api/query/:queryName', (req, res) => {
  // New route to fetch data based on query name
  const { queryName } = req.params;
  const query = distinctQueries[queryName];

  if (!query) {
    return res.status(404).send('Query not found');
  }

  fetchData(query, `Error fetching ${queryName}`, res);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Backend!');
});

// Route for users
app.get('/api/users', (req, res) => fetchData(Users.prototype.getAllUsers, 'Error fetching users', res));

// Route for accidents
app.get('/api/accidents', (req, res) =>
  fetchData(Accidents.prototype.getAllAccidents, 'Error fetching accidents', res)
);

// Route for emergency services
app.get('/api/emergency-services', (req, res) =>
  fetchData(EmergencyServices.prototype.getAllEmergencyServices, 'Error fetching emergency services', res)
);

// Route for user accidents
app.get('/api/user-accidents', (req, res) =>
  fetchData(UserAccidents.prototype.getAllUserAccidents, 'Error fetching user accidents', res)
);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
