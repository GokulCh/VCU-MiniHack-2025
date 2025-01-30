import { db } from '../db.js';

class Accidents {
  constructor() {
    this.table = 'Accidents';
  }

  async createAccident(accident) {
    try {
      const [results] = await db.query('INSERT INTO Accidents SET ?', accident);
      return results.insertId;
    } catch (err) {
      throw new Error('Error creating accident: ' + err);
    }
  }

  async getAllAccidents() {
    try {
      const [results] = await db.query('SELECT * FROM Accidents');
      return results;
    } catch (err) {
      throw new Error('Error fetching accidents: ' + err);
    }
  }

  async updateAccident(id, accident) {
    try {
      const [results] = await db.query('UPDATE Accidents SET ? WHERE id = ?', [accident, id]);
      return results.affectedRows;
    } catch (err) {
      throw new Error('Error updating accident: ' + err);
    }
  }

  async deleteAccident(id) {
    try {
      const [results] = await db.query('DELETE FROM Accidents WHERE id = ?', id);
      return results.affectedRows;
    } catch (err) {
      throw new Error('Error deleting accident: ' + err);
    }
  }
}

export { Accidents };
