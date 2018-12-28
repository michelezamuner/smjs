const AppConfig = require('./src/app/AppConfig');
const args = process.argv.slice(2);

let architecture = 'sma';
let file;

for (const arg in args) {
    if (arg.startsWith('--arc=')) {
        architecture = arg.substring(6);
        continue;
    }

    file = arg;
}

if (file === null) {
    throw new Error('No program file given');
}

const config = new AppConfig(architecture, file);

// @todo: define container and run app
