import { db } from '../db.js';

class Locations {
  constructor() {
    this.table = 'Locations';
  }

  async createLocation(location) {
    try {
      // Validate latitude and longitude
      const { latitude, longitude } = location;
      if (latitude < -90 || latitude > 90) {
        throw new Error('Latitude must be between -90 and 90');
      }
      if (longitude < -180 || longitude > 180) {
        throw new Error('Longitude must be between -180 and 180');
      }

      const [results] = await db.query('INSERT INTO Locations SET ?', location);
      return results.insertId;
    } catch (err) {
      throw new Error('Error creating location: ' + err);
    }
  }

  async getAllLocations() {
    try {
      const [results] = await db.query('SELECT * FROM Locations');
      return results;
    } catch (err) {
      throw new Error('Error fetching locations: ' + err);
    }
  }

  async getLocationById(id) {
    try {
      console.log('Fetching location for ID:', id); // Debug log
      const [results] = await db.query('SELECT * FROM Locations WHERE location_id = ?', [id]);
      console.log('Results from DB:', results); // Debug log
      return results[0]; // Assuming results are an array and you're returning the first match
    } catch (err) {
      throw new Error('Error fetching location: ' + err);
    }
  }

  async updateLocation(id, location) {
    try {
      const [results] = await db.query('UPDATE Locations SET ? WHERE location_id = ?', [location, id]);
      return results.affectedRows;
    } catch (err) {
      throw new Error('Error updating location: ' + err);
    }
  }

  async deleteLocation(id) {
    try {
      await db.query(
        'DELETE FROM UserAccidents WHERE accident_id IN (SELECT accident_id FROM Accidents WHERE location_id = ?)',
        [id]
      );
      await db.query(
        'DELETE FROM EmergencyServices WHERE accident_id IN (SELECT accident_id FROM Accidents WHERE location_id = ?)',
        [id]
      );
      await db.query('DELETE FROM Accidents WHERE location_id = ?', [id]);

      const [results] = await db.query('DELETE FROM Locations WHERE location_id = ?', [id]);
      return results.affectedRows;
    } catch (err) {
      throw new Error('Error deleting location: ' + err);
    }
  }
}

export { Locations };
