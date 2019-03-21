const Request = require('./Request');
const ActuatorActivated = require('./messages/ActuatorActivated');
const Actuator = require('../../actuator/Actuator');
const Notifier = require('../../notifications/Notifier');

module.exports = class Sensor_SendSignal_SendSignal {
    static get __DEPS__() { return [ Actuator, Notifier ]; }

    /**
     * @param {Actuator} actuator
     * @param {Notifier} notifier
     */
    constructor(actuator, notifier) {
        this._actuator = actuator;
        this._notifier = notifier;
    }

    /**
     * @param {Request} request
     */
    send(request) {
        const signal = request.getSignal();

        this._actuator.activate(signal);
        this._notifier.notify(new ActuatorActivated(signal));
    }
};
