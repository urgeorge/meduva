CREATE TABLE IF NOT EXISTS service (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(3000),
    duration_in_min INT NOT NULL,
    price DECIMAL(19, 2) NOT NULL,
    deleted TINYINT DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS room (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(3000),
    deleted TINYINT DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS equipment_model (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    deleted TINYINT DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS equipment_item (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    deleted TINYINT DEFAULT 0 NOT NULL,
    equipment_model_id INT NOT NULL,
    FOREIGN KEY (equipment_model_id) REFERENCES equipment_model (id)
);