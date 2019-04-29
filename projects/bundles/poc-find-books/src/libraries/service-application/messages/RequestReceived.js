const _package = 'FindBooks.ServiceApplication.Messages.';

const ServiceRequest = require('../input-parser/ServiceRequest');

module.exports = class RequestReceived {
    static toString() { return _package + RequestReceived.name; }

    /**
     * @param {ServiceRequest} request
     */
    constructor(request) {
        this._request = request;
    }

    /**
     * @return {ServiceRequest}
     */
    getRequest() {
        return this._request;
    }
};
