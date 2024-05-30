-- Destroy database if exists --
DROP DATABASE IF EXISTS emp_db;

-- Create a new database --
CREATE DATABASE emp_db;

-- Connect to the newly created database --
\c emp_db;

-- Destroy tables if exists --
DROP TABLE IF EXISTS department CASCADE;
DROP TABLE IF EXISTS role CASCADE;
DROP TABLE IF EXISTS employee CASCADE;
DROP TABLE IF EXISTS manager CASCADE;

-- Create table department --
CREATE TABLE department (
    department_id SERIAL,
    department_name VARCHAR(30) UNIQUE NOT NULL,
    PRIMARY KEY (department_id)
);

-- Create table role --
CREATE TABLE role (
    role_id SERIAL,
    role_title VARCHAR(40) UNIQUE NOT NULL,
    role_salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY (role_id),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE CASCADE
);

-- Create table manager --
CREATE TABLE manager (
    manager_id SERIAL,
    manager_name VARCHAR(70) NOT NULL,
    role_id INTEGER NOT NULL,
    PRIMARY KEY (manager_id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE CASCADE
);

-- Create table employee --
CREATE TABLE employee (
    emp_id SERIAL,
    emp_first VARCHAR(30) NOT NULL,
    emp_last VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER DEFAULT NULL,
    PRIMARY KEY (emp_id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE CASCADE,
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES manager(manager_id) ON DELETE CASCADE
);

-- Transaction block to populate database
INSERT INTO department (department_name)
VALUES
    ('Accounting'),
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');

INSERT INTO role (role_title, role_salary, department_id)
VALUES
    ('Accountatnt', 80000, 1),
    ('Accountant Lead', 100000, 1),
    ('Lawyer', 100000, 4),
    ('Legal Team Lead', 120000, 4),
    ('Software Engineer', 90000, 2),
    ('Software Team Lead', 120000, 2),
    ('Salesperson', 70000, 5),
    ('Sales Team Lead', 100000, 5);

INSERT INTO manager (manager_name, role_id)
VALUES 
    ('Michael Smith', 2),
    ('Larry Bird', 4),
    ('Michael Jordan', 6),
    ('Mira Murati', 8);

INSERT INTO employee (emp_first, emp_last, role_id, manager_id)
VALUES 
    ('John', 'Doe', 1, 1),
    ('Michael', 'Smith', 2, null),
    ('David', 'Green', 3, 2),
    ('Larry', 'Bird', 4, null),
    ('Victor', 'Smolin', 5, 3),
    ('Michael', 'Jordan', 6, null),
    ('Greg', 'Goulash', 7, 4),
    ('Mira', 'Murati', 8, null);
