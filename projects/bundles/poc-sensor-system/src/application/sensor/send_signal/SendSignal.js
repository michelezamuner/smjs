const Request = require('./Request');
const ActuatorActivated = require('./messages/ActuatorActivated');
const Actuator = require('../../actuator/Actuator');
const MessageBus = require('../../message-bus/MessageBus');

module.exports = class Sensor_SendSignal_SendSignal {
    static get __DEPS__() { return [ Actuator, MessageBus ]; }

    /**
     * @param {Actuator} actuator
     * @param {MessageBus} bus
     */
    constructor(actuator, bus) {
        this._actuator = actuator;
        this._bus = bus;
    }

    /**
     * @param {Request} request
     */
    send(request) {
        const signal = request.getSignal();

        this._actuator.activate(signal);
        this._bus.send(new ActuatorActivated(signal));
    }
};
