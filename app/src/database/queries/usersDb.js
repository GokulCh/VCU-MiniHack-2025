import { db } from '../db.js';

class Users {
  constructor() {
    this.table = 'Users';
  }

  async createUser(user) {
    try {
      const [results] = await db.query('INSERT INTO Users SET ?', user);
      return results.insertId;
    } catch (err) {
      throw new Error('Error creating user: ' + err);
    }
  }

  async getAllUsers() {
    try {
      const [results] = await db.query('SELECT * FROM Users');
      return results;
    } catch (err) {
      throw new Error('Error fetching users: ' + err);
    }
  }

  async updateUser(id, user) {
    try {
      const [results] = await db.query('UPDATE Users SET ? WHERE id = ?', [user, id]);
      return results.affectedRows;
    } catch (err) {
      throw new Error('Error updating user: ' + err);
    }
  }

  async deleteUser(id) {
    try {
      const [results] = await db.query('DELETE FROM Users WHERE id = ?', id);
      return results.affectedRows;
    } catch (err) {
      throw new Error('Error deleting user: ' + err);
    }
  }
}

export { Users };
