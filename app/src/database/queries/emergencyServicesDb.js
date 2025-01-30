import { db } from '../db.js';

class EmergencyServices {
  constructor() {
    this.table = 'EmergencyServices';
  }

  async createEmergencyService(emergencyService) {
    try {
      const [results] = await db.query('INSERT INTO EmergencyServices SET ?', emergencyService);
      return results.insertId;
    } catch (err) {
      throw new Error('Error creating emergency service: ' + err);
    }
  }

  async getAllEmergencyServices() {
    try {
      const [results] = await db.query('SELECT * FROM EmergencyServices');
      return results;
    } catch (err) {
      throw new Error('Error fetching emergency services: ' + err);
    }
  }

  async updateEmergencyService(id, emergencyService) {
    try {
      const [results] = await db.query('UPDATE EmergencyServices SET ? WHERE id = ?', [emergencyService, id]);
      return results.affectedRows;
    } catch (err) {
      throw new Error('Error updating emergency service: ' + err);
    }
  }

  async deleteEmergencyService(id) {
    try {
      const [results] = await db.query('DELETE FROM EmergencyServices WHERE id = ?', id);
      return results.affectedRows;
    } catch (err) {
      throw new Error('Error deleting emergency service: ' + err);
    }
  }
}

export { EmergencyServices };
