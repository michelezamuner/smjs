const RequestInterface = require('../../../../../application/sensor/send_signal/Request');
const Signal = require('../../../../../domain/signal/Signal');

module.exports = class Request extends RequestInterface {
    /**
     * @param {string} value
     */
    constructor(value) {
        super();
        this._value = value;
    }

    /**
     * @return {Signal}
     */
    getSignal() {
        return new Signal(this._value);
    }
};
