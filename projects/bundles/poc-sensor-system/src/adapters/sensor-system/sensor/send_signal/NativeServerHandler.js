const _package = 'SensorSystem.SensorSystem.Sensor.SendSignal.';
const Socket = require('net').Socket;

module.exports = class NativeServerHandler {
    static toString() { return _package + NativeServerHandler.name; }

    constructor() {
        if (new.target === NativeServerHandler) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Socket} client
     */
    handle(client) {
        throw 'Not implemented';
    }
};
