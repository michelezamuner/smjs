const ServerBuilder = require('./ServerBuilder');
const SignalHandler = require('./SignalHandler');

module.exports = class SensorSystem_Sensor_SendSignal_SignalListener {
    static get __DEPS__() { return [ ServerBuilder, SignalHandler ]; }

    /**
     * @param {ServerBuilder} builder
     * @param {SignalHandler} handler
     */
    constructor(builder, handler) {
        this._builder = builder;
        this._handler = handler;
    }

    /**
     * @param {string} host
     * @param {number} port
     */
    listen(host, port) {
        const server = this._builder.build(this._handler);
        server.listen(port, host);
    }
};
