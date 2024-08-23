-- Creating the COP4331 Database
CREATE DATABASE IF NOT EXISTS COP4331;
USE COP4331;

-- Creating the Users table
CREATE TABLE IF NOT EXISTS `Users` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `DateCreated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DateLastLoggedIn` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `FirstName` VARCHAR(50) NOT NULL DEFAULT '',
  `LastName` VARCHAR(50) NOT NULL DEFAULT '',
  `Login` VARCHAR(50) NOT NULL DEFAULT '',
  `Password` VARCHAR(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`ID`)
) ENGINE = InnoDB;

-- Creating the Colors table
CREATE TABLE IF NOT EXISTS `Colors` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(50) NOT NULL DEFAULT '',
  `UserID` INT NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`UserID`) REFERENCES `Users`(`ID`)
) ENGINE = InnoDB;

-- Creating the Contacts table
CREATE TABLE IF NOT EXISTS `Contacts` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(50) NOT NULL DEFAULT '',
  `Phone` VARCHAR(50) NOT NULL DEFAULT '',
  `Email` VARCHAR(50) NOT NULL DEFAULT '',
  `UserID` INT NOT NULL,
  PRIMARY KEY (`ID`),
  FOREIGN KEY (`UserID`) REFERENCES `Users`(`ID`)
) ENGINE = InnoDB;

-- Insert example data into Users
INSERT INTO `Users` (`FirstName`, `LastName`, `Login`, `Password`) VALUES
('Rick', 'Leinecker', 'RickL', '5832a71366768098cceb7095efb774f2'),
('Sam', 'Hill', 'SamH', '0cbc6611f5540bd0809a388dc95a615b');

-- Insert example data into Colors linked to the first user
INSERT INTO `Colors` (`Name`, `UserID`) VALUES
('Blue', 1),
('White', 1),
('Black', 1),
('Gray', 1),
('Magenta', 1),
('Yellow', 1),
('Cyan', 1),
('Salmon', 1),
('Chartreuse', 1),
('Lime', 1),
('Light Blue', 1),
('Light Gray', 1),
('Light Red', 1),
('Light Green', 1),
('Chiffon', 1),
('Fuscia', 1),
('Brown', 1),
('Beige', 1);

-- Insert example data into Colors linked to the third user (assuming ID 3 exists)
INSERT INTO `Colors` (`Name`, `UserID`) VALUES
('Blue', 3),
('White', 3),
('Black', 3),
('Gray', 3),
('Magenta', 3),
('Yellow', 3),
('Cyan', 3),
('Salmon', 3),
('Chartreuse', 3),
('Lime', 3),
('Light Blue', 3),
('Light Gray', 3),
('Light Red', 3),
('Light Green', 3),
('Chiffon', 3),
('Fuscia', 3),
('Brown', 3),
('Beige', 3);


