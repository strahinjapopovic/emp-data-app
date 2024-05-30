// Load inquirer CLI module
const inquirer = require("inquirer");

//************************************************************************************************************//
//******************************** Functions With Prompt Extensions ******************************************//
//************************************************************************************************************//
// fn to add department into database
const addDepartment = async () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "Insert department name: >",
            validate: function (input) {
            // Set up async fn and save the done callback
                const done = this.async();
                setTimeout( function() {
                    if ( !input ) {
                    // Message callback for error validation
                    done("Department name should not be empty");
                    } else {
                    // Validation corect proceed with prompts
                    done(null, true);
                    }
                }, 2000);
            }
        },
    ])
}
module.exports = { addDepartment };