const _package = 'SensorSystem.Sensor.SendSignal.Messages.';

const Signal = require('../../../../domain/signal/Signal');

module.exports = class ActuatorActivated {
    static toString() { return _package + ActuatorActivated.name; }

    /**
     * @param {Signal} signal
     */
    constructor(signal) {
        this._signal = signal;
    }

    /**
     * @return {Signal}
     */
    getSignal() {
        return this._signal;
    }
};
