//************************************************************************************************************//
//********************************************** Init Setup **************************************************//
//************************************************************************************************************//

// Load express module over require function
const express = require("express");

// Load pool connection function over module.exports
const pool = require("./config/pool-connect");

// Load inquirer CLI module
const inquirer = require("inquirer");

// Import display sequelized departments fn
const { displayDepartments } = require("./functions/sql-seq");

// Load fn from ~/functions/sql-pool.js
const { addDepartment } = require("./functions/sql-pool");

// Load fn for render application logo with figlet and chalik
const displayLogo = require("./functions/logo");

// Load main interface fn
const mainInterface = require("./interface/main-interface");

// open sequelize direct connection with database
const sequelize = require("./config/connect");

// Validator npm package for checking decimal value of input prompts
const validator = require('validator');

// Import all model files from models directory
const Role = require("./models/role");
const Employee = require("./models/employee");
const Department = require("./models/department");

// Load console.table npm node package module for table data rendering at CLI terminal
const console_table = require('console.table');
const custom_table = require('./functions/table-view');

// Make app more colorful and prity
const chalk = require('chalk');

// Defining executable express function with en empty argument called from node modules packages
const app = express();

// Defining opened port
const PORT = process.env.PORT || 3001;

// Defining express middleware for parsing json objects and arrays and encoding url data params
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// sequelize sync asynhronius function that open connection and synhronization all models with databace at once  
sequelize.sync({ force: false });

//************************************************************************************************************//
//******************************************** Init Prompt Handler *******************************************//
//************************************************************************************************************//
const userInterface = async () => {
        return await mainInterface().then((dataAns) => {
        if (dataAns.optAns === "Display All Departments") {
            console.log(chalk.rgb(0, 255, 0).bold(`\n        Department`));
            console.log(chalk.rgb(0, 255, 0).bold(`------------------------------\n`));
            displayDepartments().then(() => {
                console.log(chalk.rgb(0, 255, 0).bold(`------------------------------\n`));
                userInterface();
            });
        }
        else if (dataAns.optAns === "Display All Roles") {
            console.log(chalk.rgb(0, 255, 0).bold(`\n                       Role`));
            console.log(chalk.rgb(0, 255, 0).bold(`------------------------------------------------------\n`));
            displayRole();
        }
        else if (dataAns.optAns === "Display All Employees") {
            console.log(chalk.rgb(0, 255, 0).bold(`\n                                          Employee`));
            console.log(chalk.rgb(0, 255, 0).bold(`-----------------------------------------------------------------------------------------------\n`));
            displayEmployees();
        }
        else if (dataAns.optAns === "Add Department") {
            console.log(chalk.rgb(0, 255, 0).bold(`\n         Add Department`));
            console.log(chalk.rgb(0, 255, 0).bold(`-----------------------------------\n`));
            addDepartment().then((dataAns) => {
                execAddDepartment(dataAns);
            });
        }
        else if (dataAns.optAns === "Add Role") {
            console.log(chalk.rgb(0, 255, 0).bold(`\n            Add Role`));
            console.log(chalk.rgb(0, 255, 0).bold(`-----------------------------------\n`));
            addRole();
        }
        else if (dataAns.optAns === "Add Employee") {
            console.log(chalk.rgb(0, 255, 0).bold(`\n         Add Employee`));
            console.log(chalk.rgb(0, 255, 0).bold(`-----------------------------------\n`));
            addEmployee();
        }
        else if (dataAns.optAns === "Update Employee Role") {
            console.log(chalk.rgb(0, 255, 0).bold(`\n     Update Employee Role`));
            console.log(chalk.rgb(0, 255, 0).bold(`-----------------------------------\n`));
            updateEmployeeRole();
        }
        else if (dataAns.optAns === "Exit") {
            exitFn();
        }
    }).catch((error) => {
        if (error.isTtyError) {
            console.log(`Prompt couldn't be rendered in the current environment.\n\nERROR msg: ${error}\n\n`);
        } else {
            console.log(`Unexpected error event.\n\nERROR msg: ${error}\n\n`);
        }
    });
}
//************************************************************************************************************//
//************************************ Functions With DB Transactions ****************************************//
//************************************************************************************************************//
// display all employee fn
const displayEmployees = async () => {
    const connectdb = await pool.connect();
    const sql = `SELECT
    employee.emp_id AS "Employee ID",
    employee.emp_first AS "First Name",
    employee.emp_last AS "Last Name",
    role.role_title AS "Title",
    department.department_name AS "Department",
    role.role_salary AS "Salary",
	manager.manager_name AS "Manager"
    FROM employee employee
    INNER JOIN role role
    ON employee.role_id = role.role_id
    INNER JOIN department department
    ON role.department_id = department.department_id
    FULL JOIN manager manager
    ON employee.manager_id = manager.manager_id
    ORDER BY emp_id;`
    connectdb.query(sql, (err, { rows }) => {
        if (err) {
            console.log(err);
        } else {
            console.table(rows);
            console.log(chalk.rgb(0, 255, 0).bold(`-----------------------------------------------------------------------------------------------\n`));
            userInterface();
        }
    });
}
// display all roles fn
const displayRole = async () => {
    const connectdb = await pool.connect();
    let sql = `SELECT 
    role.role_id AS "Role ID", 
    role.role_title AS "Title",
    department.department_name AS "Department Name",
    role.role_salary AS "Salary" 
    FROM role role
    INNER JOIN department department
    ON role.department_id = department.department_id
    ORDER BY role_id;`;
    connectdb.query(sql, (err, { rows }) => {
        if (err) {
            console.log(err);
        } else {
            console.table(rows);
            console.log(chalk.rgb(0, 255, 0).bold(`------------------------------------------------------\n`));
            userInterface();
        }
    });
}
//************************************************************************************************************//
//******************* Executable part of functions that target database transactions *************************//
//************************************************************************************************************//
// add department executable fn
const execAddDepartment = async (dataAns) => {
    const connectdb = await pool.connect();
    const sql = 'INSERT INTO department (department_name) VALUES ($1)';
    connectdb.query(sql, [dataAns.departmentName]);
    console.log(chalk.cyan.bold(`\n${dataAns.departmentName} Department Added Successfully.\n`));
    console.log(chalk.rgb(0, 255, 0).bold(`-----------------------------------\n`));
    userInterface();
}
// add role executable fn
const execAddRole = async (dataAns) => {
    const connectdb = await pool.connect();
    const sqlGetDepID = 'SELECT department_id FROM department WHERE department_name = $1;';
    connectdb.query(sqlGetDepID, [dataAns.departmentName], (err, { rows }) => {
        if (err) {
            console.log(err);
        } else {
            const sql = 'INSERT INTO role (role_title, role_salary, department_id) VALUES ($1, $2, $3);';
            connectdb.query(sql, [dataAns.roleTitle, dataAns.roleSalary, rows[0].department_id]);
            console.log(chalk.rgb(0, 255, 255).bold(`\nRole name: ${dataAns.roleTitle}`));
            console.log(chalk.rgb(0, 255, 0)(`---${chalk.rgb(255, 215, 0)('---')}${chalk.rgb(0, 255, 255)('---')}`));
            console.log(chalk.rgb(0, 255, 255).bold(`Salary amount: ${dataAns.roleSalary}`));
            console.log(chalk.rgb(0, 255, 0)(`---${chalk.rgb(255, 215, 0)('---')}${chalk.rgb(0, 255, 255)('---')}`));
            console.log(chalk.rgb(0, 255, 255).bold(`Department ID: ${rows[0].department_id}`));
            console.log(chalk.rgb(0, 255, 0)(`---${chalk.rgb(255, 215, 0)('---')}${chalk.rgb(0, 255, 255)('---')}`));
            console.log(chalk.rgb(0, 255, 255).bold(`Department name: ${dataAns.departmentName}`));
            console.log(chalk.rgb(0, 255, 0)(`---${chalk.rgb(255, 215, 0)('---')}${chalk.rgb(0, 255, 255)('---')}`));
            console.log(chalk.rgb(0, 255, 255).bold(`All data fot table role added successfully.`));
            console.log(chalk.rgb(0, 255, 0).bold(`-----------------------------------\n`));
            userInterface();
        }
    });
}
// add employee executable fn
const execAddEmployee = async (dataAns) => {
    const connectdb = await pool.connect();
    const sqlGetRoleID = `SELECT role_id FROM role WHERE role_title = $1;`;
    // Insert data into table employee
    const sql = `INSERT INTO employee (emp_first, emp_last, role_id, manager_id) VALUES ($1, $2, $3, $4);`;
    connectdb.query(sqlGetRoleID, [dataAns.roleTitle], (err, { rows }) => {
        if (err) {
            console.log(err);
        } else {
            const roleID = rows[0].role_id;
            if (dataAns.managerName === "null") {
                connectdb.query(sql, [dataAns.employeeFirst, dataAns.employeeLast, roleID, null]);
                // Message after execution ends
                console.log(chalk.rgb(0, 255, 255).bold(`\nEmployee name: ${dataAns.employeeFirst} ${dataAns.employeeLast}`));
                console.log(chalk.rgb(0, 255, 0)(`---${chalk.rgb(255, 215, 0)('---')}${chalk.rgb(0, 255, 255)('---')}`));
                console.log(chalk.rgb(0, 255, 255).bold(`Role title: ${dataAns.roleTitle}`));
                console.log(chalk.rgb(0, 255, 0)(`---${chalk.rgb(255, 215, 0)('---')}${chalk.rgb(0, 255, 255)('---')}`));
                console.log(chalk.rgb(0, 255, 255).bold(`Role ID: ${roleID}`));
                console.log(chalk.rgb(0, 255, 0)(`---${chalk.rgb(255, 215, 0)('---')}${chalk.rgb(0, 255, 255)('---')}`));
                console.log(chalk.rgb(0, 255, 255).bold(`Manager name: [${dataAns.managerName}]`));
                console.log(chalk.rgb(0, 255, 0)(`---${chalk.rgb(255, 215, 0)('---')}${chalk.rgb(0, 255, 255)('---')}`));
                console.log(chalk.rgb(0, 255, 255).bold(`Manager ID: [${dataAns.managerName}]`));
                console.log(chalk.rgb(0, 255, 0)(`---${chalk.rgb(255, 215, 0)('---')}${chalk.rgb(0, 255, 255)('---')}`));
                console.log(chalk.rgb(0, 255, 255).bold(`All data for table employee added successfully.`));
                console.log(chalk.rgb(0, 255, 0).bold(`-----------------------------------\n`));
                userInterface();
            } else {
                const sqlGetMngID = `SELECT manager_id FROM manager WHERE manager_name = $1;`;
                connectdb.query(sqlGetMngID, [dataAns.managerName], (err, { rows }) => {
                    if (err) {
                        console.log(err);
                    } else {
                        connectdb.query(sql, [dataAns.employeeFirst, dataAns.employeeLast, roleID, rows[0].manager_id]);
                        console.log(chalk.rgb(0, 255, 255).bold(`\nEmployee name: ${dataAns.employeeFirst} ${dataAns.employeeLast}`));
                        console.log(chalk.rgb(0, 255, 0)(`---${chalk.rgb(255, 215, 0)('---')}${chalk.rgb(0, 255, 255)('---')}`));
                        console.log(chalk.rgb(0, 255, 255).bold(`Role title: ${dataAns.roleTitle}`));
                        console.log(chalk.rgb(0, 255, 0)(`---${chalk.rgb(255, 215, 0)('---')}${chalk.rgb(0, 255, 255)('---')}`));
                        console.log(chalk.rgb(0, 255, 255).bold(`Role ID: ${roleID}`));
                        console.log(chalk.rgb(0, 255, 0)(`---${chalk.rgb(255, 215, 0)('---')}${chalk.rgb(0, 255, 255)('---')}`));
                        console.log(chalk.rgb(0, 255, 255).bold(`Manager name: ${dataAns.managerName}`));
                        console.log(chalk.rgb(0, 255, 0)(`---${chalk.rgb(255, 215, 0)('---')}${chalk.rgb(0, 255, 255)('---')}`));
                        console.log(chalk.rgb(0, 255, 255).bold(`Manager ID: ${rows[0].manager_id}`));
                        console.log(chalk.rgb(0, 255, 0)(`---${chalk.rgb(255, 215, 0)('---')}${chalk.rgb(0, 255, 255)('---')}`));
                        console.log(chalk.rgb(0, 255, 255).bold(`All data for table employee added successfully.`));
                        console.log(chalk.rgb(0, 255, 0).bold(`-----------------------------------\n`));
                        userInterface();
                    }
                });
            }
        }
    });
}
// update employee role executable fn
const execUpdateEmployeeRole = async (dataAns) => {
    const connectdb = await pool.connect();
    const sqlGetRoleID = `SELECT role_id FROM role WHERE role_title = $1;`;
    const sql = `UPDATE employee SET role_id = $1 WHERE CONCAT(emp_first, ' ', emp_last) = $2;`;
    connectdb.query(sqlGetRoleID, [dataAns.roleTitle], (err, { rows }) => {
        if (err) {
            console.log(err);
        } else {
            const roleID = rows[0].role_id;
            connectdb.query(sql, [roleID, dataAns.employeeName])
            console.log(chalk.rgb(0, 255, 255).bold(`\nEmployee name: ${dataAns.employeeName}`));
            console.log(chalk.rgb(255, 215, 0).bold(`----`));
            console.log(chalk.rgb(0, 255, 255).bold(`Role ID: ${roleID}`));
            console.log(chalk.rgb(255, 215, 0).bold(`---`));
            console.log(chalk.rgb(0, 255, 255).bold(`Role name: ${dataAns.roleTitle}`));
            console.log(chalk.rgb(255, 215, 0).bold(`---`));
            console.log(chalk.rgb(0, 255, 255).bold(`All data for table employee updated successfully.`));
            console.log(chalk.rgb(0, 255, 0).bold(`-----------------------------------\n`));
            userInterface();
        }
    });
}
//************************************************************************************************************//
//*********************************************** END ********************************************************//
//************************************************************************************************************//

//************************************************************************************************************//
//******************************** Functions With Prompt Extensions ******************************************//
//************************************************************************************************************//
// fn to add role into database
const addRole = async () => {
    const connectdb = await pool.connect();
    let sql = `SELECT department_name FROM department ORDER BY department_name;`;
    connectdb.query(sql, (err, {rows}) => {
        if(err) {
            console.log(err);
        } else {
            let objArray = [];
            rows.forEach((depData) => {
                objArray.push(depData.department_name);
            });
            objArray.push("Add Department");
            objArray.push("Exit");
            inquirer.prompt([
                {
                    type: "input",
                    name: "roleTitle",
                    message: "Insert role name: >",
                    validate: function (input) {
                        // Set up async fn and save the done callback
                            const done = this.async();
                            setTimeout( function() {
                                if ( !input ) {
                                // Message callback for error validation
                                done("Role name should not be empty");
                                } else {
                                // Validation corect proceed with prompts
                                done(null, true);
                                }
                            }, 2000);
                        }
                },
                {
                    type: "input",
                    name: "roleSalary",
                    message: "Insert salary amount for the role: >",
                    validate: function (input) {
                        // Set up async fn and save the done callback
                        const done = this.async();
                        setTimeout( function() {
                            if ( validator.isDecimal(input) === false ) {
                            // Message callback for error validation
                            done("Salary amount should be an decimal number");
                            } else {
                            // Validation corect proceed with prompts
                            done(null, true);
                            }
                        }, 2000);
                    }
                },
                {
                    type: "list",
                    name: "departmentName",
                    message: "Select department that role belong to: >",
                    choices: objArray,
                },
            ]).then((dataAns) => {
                if (dataAns.departmentName === "Add Department") {
                    addDepartment();
                }
                else if (dataAns.departmentName === "Exit") {
                    exitFn();
                } else {
                    execAddRole(dataAns);
                }
            });
        }
    });
}
// fn to add employee to database
const addEmployee = async () => {
    const connectdb = await pool.connect();
    const sql = `SELECT role_title FROM role ORDER BY role_title;`;
    connectdb.query(sql, (err, {rows}) => {
        if(err) {
            console.log(err);
        } else {
            let objArrayRol = [];
            rows.forEach((rolData) => {
                objArrayRol.push(rolData.role_title);
            });
            const sqlSec = `SELECT manager_name FROM manager ORDER BY manager_name;`;
            connectdb.query(sqlSec, (err, {rows}) => {
                if(err) {
                    console.log(err);
                } else {
                    let objArrayMng = [];
                    rows.forEach((mngData) => {
                        objArrayMng.push(mngData.manager_name);
                    });
                    objArrayMng.push("Add Role");
                    objArrayMng.push('null');
                    objArrayMng.push("Exit"); 
                        inquirer.prompt([
                        {
                            type: "input",
                            name: "employeeFirst",
                            message: "Insert emplyee first name: >",
                            validate: function (input) {
                                // Set up async fn and save the done callback
                                const done = this.async();
                                setTimeout( function() {
                                    if ( !input ) {
                                    // Message callback for error validation
                                    done("Employee first name should not be empty");
                                    } else {
                                    // Validation corect proceed with prompts
                                    done(null, true);
                                    }
                                }, 2000);
                            }
                        },
                        {
                            type: "input",
                            name: "employeeLast",
                            message: "Insert emplyee last name: >",
                            validate: function (input) {
                                // Set up async fn and save the done callback
                                const done = this.async();
                                setTimeout( function() {
                                    if ( !input ) {
                                    // Message callback for error validation
                                    done("Employee last name should not be empty");
                                    } else {
                                    // Validation corect proceed with prompts
                                    done(null, true);
                                    }
                                }, 2000);
                            }
                        },
                        {
                            type: "list",
                            name: "roleTitle",
                            message: "Select role title for employee: >",
                            choices: objArrayRol,
                        },
                        {
                            type: "list",
                            name: "managerName",
                            message: "Select manager for the employee or set null: >",
                            choices: objArrayMng,
                        },
                    ]).then((dataAns) => {
                        if (dataAns.managerName === "Add Role") {
                            addRole();
                        }
                        else if (dataAns.managerName === "Exit") {
                            exitFn();
                        } else {
                            execAddEmployee(dataAns);
                        }
                    });
                }
            });
        }
    });
}
//fn to update employee data from databse
const updateEmployeeRole = async () => {
    const connectdb = await pool.connect();
    const sqlGetEmployee = `SELECT emp_first, emp_last FROM employee;`;
    connectdb.query(sqlGetEmployee, (err, {rows}) => {
        if (err) {
            console.log(err);
        } else {
            let objArrayEmployee = [];
            rows.forEach((empName) => {
                objArrayEmployee.push(`${empName.emp_first} ${empName.emp_last}`);
            });
            const sqlGetRole = `SELECT role_title FROM role ORDER BY role_title;`;
            connectdb.query(sqlGetRole, (err, {rows}) => {
                if (err) {
                    console.log(err);
                } else {
                    let objArrayRole = [];
                    rows.forEach((roleTitle) => {
                        objArrayRole.push(roleTitle.role_title);
                    });
                    objArrayRole.push("Add Role");
                    objArrayRole.push("Add Employee");
                    objArrayRole.push("Exit");
                    
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "employeeName",
                            message: "Select employee name to update role: >",
                            choices: objArrayEmployee,
                        },
                        {
                            type: "list",
                            name: "roleTitle",
                            message: "Select role title to assign to employe: >",
                            choices: objArrayRole,
                        },
                    ]).then((dataAns) => {
                        if (dataAns.roleTitle === "Add employee") {
                            addEmployee();
                        }
                        else if (dataAns.roleTitle === "Add Role") {
                            addRole();
                        }
                        else if (dataAns.roleTitle === "Exit") {
                            exitFn();
                        } else {
                            execUpdateEmployeeRole(dataAns);
                        }
                    });
                }
            });
        }
    });
}
// exit fn
const exitFn = () => {
    console.log(chalk.cyan.bold(`\nExit emp-data-app system...`));
    process.exit(0);
}
//************************************************************************************************************//
//*********************************************** END ********************************************************//
//************************************************************************************************************//
// Render main logo
displayLogo();

// Render main prompt interface
userInterface();

module.exports = {};