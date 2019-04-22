const Router = require('router').Router;
const Request = require('router').Request;

module.exports = class SensorSystem_Sensor_SendSignal_SignalHandler {
    static get __DEPS__() { return [ Router ]; }

    /**
     * @param {Router} router
     */
    constructor(router) {
        this._router = router;
    }

    /**
     * @param {string} signal
     */
    handleData(signal) {
        const request = new Request('sensor-system/send_signal', { signal: signal });
        this._router.route(request);
    }
};
