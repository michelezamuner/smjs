const _package = 'FindBooks.ServiceApplication.InputParser.';

module.exports = class ServiceRequest {
    static toString() { return _package + ServiceRequest.name; }

    /**
     * @param {string} endpoint
     * @param {Object} params
     * @param {Object} meta
     */
    constructor(endpoint, params = {}, meta = {}) {
        this._endpoint = endpoint;
        this._params = params;
        this._meta = meta;
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

    /**
     * @return {Object}
     */
    getMeta() {
        return this._meta;
    }
};
