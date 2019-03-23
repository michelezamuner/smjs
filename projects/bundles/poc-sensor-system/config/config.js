const config = {
    env: process.env.SM_ENV || 'dev',
    router: {
        routes: [
            {
                identifier: 'sensor-system/send_signal',
                controller: require('../src/adapters/sensor-system/sensor/send_signal/controller/Controller'),
                action: 'sendSignal(signal)',
            }
        ]
    },
    signal_listener: {
        host: '127.0.0.1',
        port: 2222,
    },
    file_actuator: {
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
