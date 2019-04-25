const _package = 'SensorSystem.Sensor.SendSignal.';

const Signal = require('../../../domain/signal/Signal');

/**
 * @interface
 */
module.exports = class Request {
    static toString() { return _package + Request.name; }

    constructor() {
        if (new.target === Request) {
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
