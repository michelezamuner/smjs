const _package = 'SensorSystem.SensorSystem.Sensor.SendSignal.';

const Router = require('router').Router;
const Request = require('router').Request;
const Socket = require('net').Socket;

module.exports = class SignalHandler {
    static get __DEPS__() { return [ Router ]; }
    static toString() { return _package + SignalHandler.name; }

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
