const _package = 'SensorSystem.SensorSystem.Sensor.SendSignal.';

const SignalHandler = require('./SignalHandler');
const net = require('net');

module.exports = class NativeServer {
    static get __DEPS__() { return [ SignalHandler ]; }
    static toString() { return _package + NativeServer.name; }

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
