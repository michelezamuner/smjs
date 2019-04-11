module.exports = class Router_Request {
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
     * @param {string} parameter
     * @return {string|undefined}
     */
    getParameter(parameter) {
        return this._parameters[parameter];
    }
};
