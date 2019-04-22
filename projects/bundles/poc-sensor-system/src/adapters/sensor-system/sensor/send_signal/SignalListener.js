const NativeServer = require('./NativeServer');

module.exports = class SensorSystem_Sensor_SendSignal_SignalListener {
    static get __DEPS__() { return [ NativeServer ]; }

    /**
     * @param {NativeServer} server
     */
    constructor(server) {
        this._server = server;
    }

    /**
     * @param {string} host
     * @param {number} port
     */
    listen(host, port) {
        this._server.listen(port, host);
    }
};
