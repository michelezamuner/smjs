const _package = 'SlothMachine.SlothMachine.';

module.exports = class ViewRegistered {
    static toString() { return _package + ViewRegistered.name; }

    /**
     * @param {string} endpoint
     * @param {Object} parameters
     */
    constructor(endpoint, parameters) {
        this._endpoint = endpoint;
        this._parameters = parameters;
    }

    /**
     * @return {string}
     */
    getEndpoint() {
        return this._endpoint;
    }

    /**
     * @return {Object}
     */
    getParameters() {
        return this._parameters;
    }
};
