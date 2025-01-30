-- Drop tables if they already exist to avoid conflicts
DROP TABLE IF EXISTS UserAccidents;
DROP TABLE IF EXISTS EmergencyServices;
DROP TABLE IF EXISTS Accidents;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Locations;
-- Create Locations table
CREATE TABLE Locations (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    street VARCHAR(255) NOT NULL,
    intersection VARCHAR(255),
    latitude DECIMAL(8, 6) CHECK (
        latitude BETWEEN -90 AND 90
    ),
    longitude DECIMAL(9, 6) CHECK (
        longitude BETWEEN -180 AND 180
    )
);
-- Create Users table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_role ENUM('driver', 'city_official', 'responder') NOT NULL,
    contact_info VARCHAR(255) NOT NULL
);
-- Create Accidents table
CREATE TABLE Accidents (
    accident_id INT AUTO_INCREMENT PRIMARY KEY,
    date_time DATETIME NOT NULL,
    severity ENUM('minor', 'moderate', 'severe') NOT NULL,
    description TEXT,
    location_id INT,
    FOREIGN KEY (location_id) REFERENCES Locations(location_id)
);
-- Create EmergencyServices table
CREATE TABLE EmergencyServices (
    service_id INT AUTO_INCREMENT PRIMARY KEY,
    service_type ENUM('ambulance', 'police', 'fire_truck') NOT NULL,
    response_time INT NOT NULL,
    accident_id INT,
    FOREIGN KEY (accident_id) REFERENCES Accidents(accident_id)
);
-- Create UserAccidents table
CREATE TABLE UserAccidents (
    user_id INT,
    accident_id INT,
    involvement_type ENUM('witness', 'driver', 'reporter') NOT NULL,
    PRIMARY KEY (user_id, accident_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (accident_id) REFERENCES Accidents(accident_id)
);