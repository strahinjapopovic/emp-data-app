// Make app more colorful and prity
const chalk = require('chalk');
const figlet = require('figlet');

const rendderLogo = () => {
    console.log(chalk.rgb(0,255,0).bold(figlet.textSync(`>>> >>> >>> >>> >>> >>> >>> >>>`)));
    console.log(`${chalk.rgb(0,255,0)(`---`)}${chalk.rgb(255,215,0)('---')}${chalk.rgb(0,255,255)('---')}`);
    console.log(chalk.rgb(0,255,255).bold(figlet.textSync(`emp-data-app`)));
    console.log(`${chalk.rgb(0,255,0)(`---`)}${chalk.rgb(255,215,0)('---')}${chalk.rgb(0,255,255)('---')}`);
    console.log(chalk.rgb(0,255,0).bold(figlet.textSync(`>>> >>> >>> >>> >>> >>> >>> >>>`)));
    console.log(chalk.rgb(0,255,255).bold(`employee data application ${chalk.rgb(0,255,0).bold('< emp-data-app >')} by ${chalk.rgb(30,144,255).bold('@codexdev')}`));
    console.log(chalk.rgb(0,255,0)('-------------------------------------------------------------------------\n'));
}
module.exports = rendderLogo;