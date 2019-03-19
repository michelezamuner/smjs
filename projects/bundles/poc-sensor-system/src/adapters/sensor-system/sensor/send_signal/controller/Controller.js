const SendSignal = require('../../../../../application/sensor/send_signal/SendSignal');
const Request = require('./Request');

module.exports = class SensorSystem_Sensor_SendSignal_Controller_Controller {
    static get __DEPS__() { return [ SendSignal ]; }

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
