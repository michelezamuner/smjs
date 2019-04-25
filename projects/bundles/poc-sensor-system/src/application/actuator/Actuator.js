const _package = 'SensorSystem.Actuator.';

const Signal = require('../../domain/signal/Signal');

/**
 * @interface
 */
module.exports = class Actuator {
    static toString() { return _package + Actuator.name; }

    constructor() {
        if (new.target === Actuator) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @param {Signal} signal
     */
    activate(signal) {
        throw 'Not implemented';
    }
};
