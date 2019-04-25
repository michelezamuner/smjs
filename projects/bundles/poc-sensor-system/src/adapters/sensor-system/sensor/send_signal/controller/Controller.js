const _package = 'SensorSystem.SensorSystem.Sensor.SendSignal.Controller.';

const SendSignal = require('../../../../../application/sensor/send_signal/SendSignal');
const Request = require('./Request');

module.exports = class Controller {
    static get __DEPS__() { return [ SendSignal ]; }
    static toString() { return _package + Controller.name; }

    /**
     * @param {SendSignal} service
     */
    constructor(service) {
        this._service = service;
    }

    /**
     * @param {string} value
     */
    sendSignal(value) {
        this._service.send(new Request(value));
    }
};
