const _package = 'SensorSystem.SensorSystem.Sensor.SendSignal.';

const NativeServer = require('./NativeServer');

module.exports = class SignalListener {
    static get __DEPS__() { return [ NativeServer ]; }
    static toString() { return _package + SignalListener.name; }

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
