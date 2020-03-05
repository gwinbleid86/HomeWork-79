CREATE DATABASE lab79;
use lab79;

CREATE TABLE category
(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(25) NOT NULL,
    discription VARCHAR(100),
    PRIMARY KEY (id)
);
CREATE TABLE location 
(
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(25) NOT NULL,
  discription VARCHAR(100) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE subject
(
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    location_id INT NOT NULL,
    title VARCHAR(25) NOT NULL,
    date_of_delivery datetime,
    image varchar(50),
    FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE RESTRICT ON UPDATE RESTRICT,
    FOREIGN KEY (location_id) REFERENCES location (id) ON DELETE RESTRICT ON UPDATE RESTRICT
);
INSERT INTO category(title, discription) VALUES ('мебель', 'старая и ужасная'),('компьютерное оборудование', '' ),('бытовая техника','');
INSERT INTO location(title, discription) VALUES ('кабинет директора', '3 этаж вторая дверь справа'),('учительская', 'центр второго этажа' ),('офис №1','');
INSERT INTO subject(category_id, location_id, title, date_of_delivery, image) VALUES (2, 2, 'стул', '2020-02-18', 'am9-3AVhsfANnjv3f4dFS.jpg');
