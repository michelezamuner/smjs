const _package = 'FindBooks.ServiceApplication.InputParser.';

module.exports = class ServiceRequest {
    static toString() { return _package + ServiceRequest.name; }

    /**
     * @param {string} endpoint
     * @param {Object} params
     */
    constructor(endpoint, params = {}) {
        this._endpoint = endpoint;
        this._params = params;
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
    getParams() {
        return this._params;
    }
};
