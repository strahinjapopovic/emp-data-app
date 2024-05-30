// Load inquirer CLI npm node module
const inquirer = require("inquirer");

const userInterfaceDisplay = () => {
    return inquirer.prompt([
         {
             type: "list",
             name: "optAns",
             pageSize: 8,
             message: "Select an option: >",
             choices: [
                 "Display All Departments",
                 "Display All Roles",
                 "Display All Employees",
                 "Add Department",
                 "Add Role",
                 "Add Employee",
                 "Update Employee Role",
                 "Exit",
             ],
         },
     ])
}
module.exports = userInterfaceDisplay;