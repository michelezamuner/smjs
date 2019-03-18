const Signal = require('../../../domain/signal/Signal');

/**
 * @interface
 */
module.exports = class Sensor_SendSignal_Request {
    constructor() {
        if (new.target === Sensor_SendSignal_Request) {
            throw 'Cannot instantiate interface';
        }
    }

    /**
     * @return {Signal}
     */
    getSignal() {
        throw 'Not implemented';
    }
};
