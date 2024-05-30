const sequelize = require("../config/connect");
const sequelizeConnectTest = async() => {
    try {
      await sequelize.authenticate();
      console.log(`\nConnection has been established successfully.\n`);
    } 
    catch (error) {
      console.error(`\nUnable to connect to the database:\n`, error);
    }
  }
  module.exports = sequelizeConnectTest;