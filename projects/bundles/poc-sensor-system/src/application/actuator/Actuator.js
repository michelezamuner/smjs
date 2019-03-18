const Signal = require('../../domain/signal/Signal');

/**
 * @interface
 */
module.exports = class Actuator_Actuator {
    constructor() {
        if (new.target === Actuator_Actuator) {
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
