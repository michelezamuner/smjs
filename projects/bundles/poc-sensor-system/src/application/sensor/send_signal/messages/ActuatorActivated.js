const Signal = require('../../../../domain/signal/Signal');

module.exports = class Sensor_SendSignal_Messages_ActuatorActivated {
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
