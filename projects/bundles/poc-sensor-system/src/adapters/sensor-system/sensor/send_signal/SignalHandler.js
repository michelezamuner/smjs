const _package = 'SensorSystem.SensorSystem.Sensor.SendSignal.';

const Router = require('router').Router;
const Request = require('router').Request;
const NativeServerHandler = require('./NativeServerHandler');

module.exports = class SignalHandler extends NativeServerHandler {
    static get __DEPS__() { return [ Router ]; }
    static toString() { return _package + SignalHandler.name; }

    /**
     * @param {Router} router
     */
    constructor(router) {
        super();
        this._router = router;
    }

    /**
     * @override
     */
    handle(client) {
        client.on('data', signal => {
            const request = new Request('sensor-system/send_signal', { signal: signal });
            this._router.route(request);
        })
    }
};
