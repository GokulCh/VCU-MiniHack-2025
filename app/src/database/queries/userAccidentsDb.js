import { db } from '../db.js';

class UserAccidents {
  constructor() {
    this.table = 'UserAccidents';
  }

  async createUserAccident(userAccident) {
    try {
      const [results] = await db.query('INSERT INTO UserAccidents SET ?', userAccident);
      return results.insertId;
    } catch (err) {
      throw new Error('Error creating user accident: ' + err);
    }
  }

  async getAllUserAccidents() {
    try {
      const [results] = await db.query('SELECT * FROM UserAccidents');
      return results;
    } catch (err) {
      throw new Error('Error fetching user accidents: ' + err);
    }
  }

  async updateUserAccident(id, userAccident) {
    try {
      const [results] = await db.query('UPDATE UserAccidents SET ? WHERE id = ?', [userAccident, id]);
      return results.affectedRows;
    } catch (err) {
      throw new Error('Error updating user accident: ' + err);
    }
  }

  async deleteUserAccident(id) {
    try {
      const [results] = await db.query('DELETE FROM UserAccidents WHERE id = ?', id);
      return results.affectedRows;
    } catch (err) {
      throw new Error('Error deleting user accident: ' + err);
    }
  }
}

export { UserAccidents };
