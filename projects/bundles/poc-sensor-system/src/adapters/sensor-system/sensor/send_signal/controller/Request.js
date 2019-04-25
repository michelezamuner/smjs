const _package = 'SensorSystem.SensorSystem.Sensor.SendSignal.Controller.';

const RequestInterface = require('../../../../../application/sensor/send_signal/Request');
const Signal = require('../../../../../domain/signal/Signal');

module.exports = class Request extends RequestInterface {
    static toString() { return _package + Request.name; }

    /**
     * @param {string} value
     */
    constructor(value) {
        super();
        this._value = value;
    }

    /**
     * @return {Signal}
     */
    getSignal() {
        return new Signal(this._value);
    }
};
