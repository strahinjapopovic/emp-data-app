// Import all model files from models directory
const Role = require("../models/role");
const Employee = require("../models/employee");
const Department = require("../models/department");

// Load console.table npm node package module for table data rendering at CLI terminal
const console_table = require('console.table');
const custom_table = require('./table-view');

// Display all departments fn
const displayDepartments = async () => {
  const department = await Department.findAll({
      attributes: [['department_id', 'Department ID'], ['department_name', 'Department Name']],
  });
  console.table(JSON.parse(JSON.stringify(department, null, 2)));
}

module.exports = { displayDepartments };