-- Drop tables if they already exist to avoid conflicts
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Trash;
DROP TABLE IF EXISTS Activities;
DROP TABLE IF EXISTS Locations;

--Create Users table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    birthdate DATE,
    distance FLOAT,
    points INT
);

--Create Trash table
CREATE TABLE Trash (
    trash_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    pollution ENUM('nuisance', 'unsightly', 'toxic') NOT NULL,
    trash_size ENUM('small', 'medium', 'large') NOT NULL,
    point_value INT NOT NULL
);

--Create Activities table
CREATE TABLE Activities (
    activity_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    activity ENUM('walking', 'running', 'freerunning', 'biking' 'jumping', 'skipping', 'swimming') NOT NULL
);

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