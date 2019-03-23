const SignalHandler = require('./SignalHandler');
const net = require('net');
const Server = require('net').Server;

module.exports = class SensorSystem_Sensor_SendSignal_ServerBuilder {
    /**
     * @param {SignalHandler} handler
     * @return Server
     */
    build(handler) {
        return net.createServer(client => {
            client.on('data', data => {
                handler.handleData(data);
            });
        });
    }
};
