const SignalHandler = require('./SignalHandler');
const net = require('net');

module.exports = class SensorySystem_Sensor_SendSignal_NativeServer {
    static get __DEPS__() { return [ SignalHandler ]; }

    /**
     * @param {SignalHandler} handler
     */
    constructor(handler) {
        this._server = net.createServer(client => handler.handle(client));
    }

    /**
     * @param {number} port
     * @param {string} host
     */
    listen(port, host) {
        this._server.listen(port, host);
    }
};
