module.exports = class SlothMachine_ViewRegistered {
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
