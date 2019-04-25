const _package = 'SlothMachine.SlothMachine.';

module.exports = class RequestReceived {
    static toString() { return _package + RequestReceived.name; }

    /**
     * @param {string} endpoint
     * @param {string} representation
     * @param {Object} parameters
     */
    constructor(endpoint, representation, parameters) {
        this._endpoint = endpoint;
        this._representation = representation;
        this._parameters = parameters;
    }

    /**
     * @return {string}
     */
    getEndpoint() {
        return this._endpoint;
    }

    /**
     * @return {string}
     */
    getRepresentation() {
        return this._representation;
    }

    /**
     * @return {Object}
     */
    getParameters() {
        return this._parameters;
    }
};
