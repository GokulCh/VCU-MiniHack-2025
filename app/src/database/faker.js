import { faker } from '@faker-js/faker';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Utility function to get random element from an array
const getRandomElement = arr => arr[Math.floor(Math.random() * arr.length)];

class DatabaseSeeder {
  constructor(connection) {
    this.db = connection;
  }

  // Create tables with proper schema and constraints
  async createTables() {
    // Drop existing tables in correct order to respect foreign key constraints
    const dropTables = [
      'DROP TABLE IF EXISTS UserAccidents',
      'DROP TABLE IF EXISTS EmergencyServices',
      'DROP TABLE IF EXISTS Accidents',
      'DROP TABLE IF EXISTS Users',
      'DROP TABLE IF EXISTS Locations',
    ];

    // Create tables with constraints
    const createTables = [
      `CREATE TABLE Locations (
        location_id INT AUTO_INCREMENT PRIMARY KEY,
        street VARCHAR(255) NOT NULL,
        intersection VARCHAR(255),
        latitude DECIMAL(8, 6) CHECK (latitude BETWEEN -90 AND 90),
        longitude DECIMAL(9, 6) CHECK (longitude BETWEEN -180 AND 180)
      )`,

      `CREATE TABLE Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        user_role ENUM('driver', 'city_official', 'responder') NOT NULL,
        contact_info VARCHAR(255) NOT NULL
      )`,

      `CREATE TABLE Accidents (
        accident_id INT AUTO_INCREMENT PRIMARY KEY,
        date_time DATETIME NOT NULL,
        severity ENUM('minor', 'moderate', 'severe') NOT NULL,
        description TEXT,
        location_id INT,
        FOREIGN KEY (location_id) REFERENCES Locations(location_id)
      )`,

      `CREATE TABLE EmergencyServices (
        service_id INT AUTO_INCREMENT PRIMARY KEY,
        service_type ENUM('ambulance', 'police', 'fire_truck') NOT NULL,
        response_time INT NOT NULL,
        accident_id INT,
        FOREIGN KEY (accident_id) REFERENCES Accidents(accident_id)
      )`,

      `CREATE TABLE UserAccidents (
        user_id INT,
        accident_id INT,
        involvement_type ENUM('witness', 'driver', 'reporter') NOT NULL,
        PRIMARY KEY (user_id, accident_id),
        FOREIGN KEY (user_id) REFERENCES Users(user_id),
        FOREIGN KEY (accident_id) REFERENCES Accidents(accident_id)
      )`,
    ];

    try {
      // Drop existing tables
      for (const dropTable of dropTables) {
        await this.db.execute(dropTable);
        console.log(`Dropped table: ${dropTable.split(' ')[4]}`);
      }

      // Create new tables
      for (const createTable of createTables) {
        await this.db.execute(createTable);
        console.log(`Created table: ${createTable.split(' ')[2]}`);
      }

      console.log('Tables created successfully!');
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  // Generate random locations
  generateLocations(count = 100) {
    const locations = [];
    for (let i = 0; i < count; i++) {
      locations.push({
        street: faker.location.street(),
        intersection: faker.location.streetAddress(),
        latitude: parseFloat(faker.location.latitude()),
        longitude: parseFloat(faker.location.longitude()),
      });
    }
    return locations;
  }

  // Generate random users
  generateUsers(count = 200) {
    const userRoles = ['driver', 'city_official', 'responder'];
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push({
        name: faker.person.fullName(),
        user_role: getRandomElement(userRoles),
        contact_info: faker.phone.number(),
      });
    }
    return users;
  }

  generateRealisticAccidentDescription() {
    const accidentTypes = [
      'rear-end collision',
      'side-swipe accident',
      'head-on collision',
      'intersection collision',
      'single-vehicle accident',
      'multi-vehicle pileup',
      'pedestrian involved accident',
    ];

    const causeFactors = [
      'driver distracted by mobile phone',
      'driver failed to yield right of way',
      'driver ran a red light',
      'slippery road conditions',
      'sudden lane change',
      'driver under the influence',
      'vehicle mechanical failure',
      'poor visibility due to weather',
      'driver fatigue',
    ];

    const severityDescriptors = {
      minor: ['minor damage to vehicles', 'no serious injuries reported', 'vehicles able to drive away'],
      moderate: ['significant vehicle damage', 'some injuries requiring medical attention', 'traffic disruption'],
      severe: [
        'extensive vehicle damage',
        'multiple serious injuries',
        'emergency services required',
        'potential road closure',
      ],
    };

    return severity => {
      const type = getRandomElement(accidentTypes);
      const cause = getRandomElement(causeFactors);
      const severityDetails = getRandomElement(severityDescriptors[severity]);

      return `${type.charAt(0).toUpperCase() + type.slice(1)} occurred due to ${cause}. ${severityDetails}.`;
    };
  }

  // Generate random accidents
  generateAccidents(locationIds, count = 300) {
    const severities = ['minor', 'moderate', 'severe'];
    const accidentDescriptionGenerator = generateRealisticAccidentDescription();
    const accidents = [];

    for (let i = 0; i < count; i++) {
      const severity = getRandomElement(severities);
      accidents.push({
        date_time: faker.date.recent({ days: 365 }),
        severity: severity,
        description: accidentDescriptionGenerator(severity),
        location_id: getRandomElement(locationIds),
      });
    }

    return accidents;
  }

  // Generate emergency services
  generateEmergencyServices(accidentIds, count = 200) {
    const serviceTypes = ['ambulance', 'police', 'fire_truck'];
    const services = [];
    for (let i = 0; i < count; i++) {
      services.push({
        service_type: getRandomElement(serviceTypes),
        response_time: faker.number.int({ min: 5, max: 120 }),
        accident_id: getRandomElement(accidentIds),
      });
    }
    return services;
  }

  // Generate user accidents (involvement)
  generateUserAccidents(userIds, accidentIds, count = 400) {
    const involvementTypes = ['witness', 'driver', 'reporter'];
    const userAccidents = new Set(); // Ensure unique combinations

    while (userAccidents.size < count) {
      const userAccident = {
        user_id: getRandomElement(userIds),
        accident_id: getRandomElement(accidentIds),
        involvement_type: getRandomElement(involvementTypes),
      };
      userAccidents.add(JSON.stringify(userAccident)); // Add as a string to ensure uniqueness
    }

    return Array.from(userAccidents).map(JSON.parse); // Convert back to objects
  }

  // Insert data into database
  // Insert data into database
  async seedDatabase() {
    try {
      // First, create tables
      await this.createTables();

      // Start transaction
      await this.db.beginTransaction();

      // Insert Locations
      const locations = this.generateLocations();
      const [locationResult] = await this.db.query(
        'INSERT INTO Locations (street, intersection, latitude, longitude) VALUES ?',
        [locations.map(l => [l.street, l.intersection, l.latitude, l.longitude])]
      );
      const locationIds = Array.from({ length: locations.length }, (_, i) => locationResult.insertId + i);

      // Insert Users
      const users = this.generateUsers();
      const [userResult] = await this.db.query('INSERT INTO Users (name, user_role, contact_info) VALUES ?', [
        users.map(u => [u.name, u.user_role, u.contact_info]),
      ]);
      const userIds = Array.from({ length: users.length }, (_, i) => userResult.insertId + i);

      // Insert Accidents
      const accidents = this.generateAccidents(locationIds);
      const [accidentResult] = await this.db.query(
        'INSERT INTO Accidents (date_time, severity, description, location_id) VALUES ?',
        [accidents.map(a => [a.date_time, a.severity, a.description, a.location_id])]
      );
      const accidentIds = Array.from({ length: accidents.length }, (_, i) => accidentResult.insertId + i);

      // Insert Emergency Services
      const emergencyServices = this.generateEmergencyServices(accidentIds);
      await this.db.query('INSERT INTO EmergencyServices (service_type, response_time, accident_id) VALUES ?', [
        emergencyServices.map(s => [s.service_type, s.response_time, s.accident_id]),
      ]);

      // Insert User Accidents
      const userAccidents = this.generateUserAccidents(userIds, accidentIds);
      await this.db.query('INSERT INTO UserAccidents (user_id, accident_id, involvement_type) VALUES ?', [
        userAccidents.map(ua => [ua.user_id, ua.accident_id, ua.involvement_type]),
      ]);

      // Commit transaction
      await this.db.commit();
      console.log('Database seeded successfully!');

      // Return some statistics
      return {
        locations: locations.length,
        users: users.length,
        accidents: accidents.length,
        emergencyServices: emergencyServices.length,
        userAccidents: userAccidents.length,
      };
    } catch (error) {
      // Rollback transaction on error
      await this.db.rollback();
      console.error('Error seeding database:', error);
      throw error;
    }
  }
}

function generateRealisticAccidentDescription() {
  const accidentTypes = [
    'rear-end collision',
    'side-swipe accident',
    'head-on collision',
    'intersection collision',
    'single-vehicle accident',
    'multi-vehicle pileup',
    'pedestrian involved accident',
  ];

  const causeFactors = [
    'driver distracted by mobile phone',
    'driver failed to yield right of way',
    'driver ran a red light',
    'slippery road conditions',
    'sudden lane change',
    'driver under the influence',
    'vehicle mechanical failure',
    'poor visibility due to weather',
    'driver fatigue',
  ];

  const severityDescriptors = {
    minor: ['minor damage to vehicles', 'no serious injuries reported', 'vehicles able to drive away'],
    moderate: ['significant vehicle damage', 'some injuries requiring medical attention', 'traffic disruption'],
    severe: [
      'extensive vehicle damage',
      'multiple serious injuries',
      'emergency services required',
      'potential road closure',
    ],
  };

  return severity => {
    const type = getRandomElement(accidentTypes);
    const cause = getRandomElement(causeFactors);
    const severityDetails = getRandomElement(severityDescriptors[severity]);

    return `${type.charAt(0).toUpperCase() + type.slice(1)} occurred due to ${cause}. ${severityDetails}.`;
  };
}

// Database connection function
async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    console.log('Connected to the MySQL database.');
    return connection;
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
}

// Main execution
async function main() {
  try {
    const connection = await connectToDatabase();
    const seeder = new DatabaseSeeder(connection);
    const stats = await seeder.seedDatabase();
    console.log('Seeding Statistics:', stats);
    await connection.end();
  } catch (error) {
    console.error('Seeding failed:', error);
  }
}

// Run the seeder
main();
