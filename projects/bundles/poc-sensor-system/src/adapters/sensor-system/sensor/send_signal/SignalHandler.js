const Router = require('router').Router;
const Request = require('router').Request;
const Socket = require('net').Socket;

module.exports = class SensorSystem_Sensor_SendSignal_SignalHandler {
    static get __DEPS__() { return [ Router ]; }

    /**
     * @param {Router} router
     */
    constructor(router) {
        this._router = router;
    }

    /**
     * @param {Socket} client
     */
    handle(client) {
        client.on('data', signal => {
            const request = new Request('sensor-system/send_signal', { signal: signal });
            this._router.route(request);
        })
    }
};
