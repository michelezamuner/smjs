const config = {
    env: process.env.SM_ENV || 'dev',
    actuator: {
        output_file: __dirname + '/../var/actuator.out',
    }
};

let envConfig = {};
switch (config.env) {
    case 'test':
        envConfig = require('./config-test');
        break;
    case 'prod':
        envConfig = require('./config-prod');
        break;
}

module.exports = { ...config, ...envConfig };
